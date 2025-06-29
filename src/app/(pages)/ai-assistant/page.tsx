"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Calendar, CheckCircle } from "lucide-react";
import { fetchUserLists } from "@/lib/actions/fetchUserLists";

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [userLists, setUserLists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false; // Changed to false for better control
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentTranscript(transcript);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
        if (currentTranscript.trim()) {
          handleUserMessage(currentTranscript);
          setCurrentTranscript("");
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setCurrentTranscript("");
        
        // Handle specific error cases
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access and try again.');
        } else if (event.error === 'no-speech') {
          console.log('No speech detected');
        } else if (event.error === 'network') {
          alert('Network error. Please check your connection.');
        }
      };

      recognition.onnomatch = () => {
        console.log('No speech match found');
        setIsListening(false);
      };

      recognition.onspeechend = () => {
        console.log('Speech ended');
        recognition.stop();
      };

      recognitionRef.current = recognition;
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    // Load user lists
    loadUserLists();

    // Add welcome message
    addMessage('assistant', "Hi! I'm your AI day planner. I can help you manage your tasks, add new ones, and keep you productive. Try saying 'What tasks do I have today?' or 'Add a new task'.");

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [currentTranscript]);

  const loadUserLists = async () => {
    try {
      const lists = await fetchUserLists();
      setUserLists(lists);
    } catch (error) {
      console.error("Error loading lists:", error);
    }
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startListening = async () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use text input instead.');
      return;
    }

    if (isListening) {
      return; // Already listening
    }

    try {
      // Request microphone permission first
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setCurrentTranscript("");
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      alert('Could not access microphone. Please check your permissions and try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleUserMessage = async (message: string) => {
    addMessage('user', message);
    setIsLoading(true);

    try {
      // Send message to AI with context about user's tasks
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userLists,
          context: {
            totalLists: userLists.length,
            totalTasks: userLists.reduce((acc, list) => acc + list.tasks.length, 0),
            pendingTasks: userLists.reduce((acc, list) => 
              acc + list.tasks.filter((task: any) => !task.completed).length, 0
            )
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      addMessage('assistant', data.response);
      
      // Speak the response
      speak(data.response);

      // Handle any actions (like creating tasks)
      if (data.action) {
        await handleAIAction(data.action);
      }

    } catch (error) {
      console.error('Error:', error);
      const errorMessage = "Sorry, I'm having trouble right now. Please try again.";
      addMessage('assistant', errorMessage);
      speak(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleUserMessage(textInput);
      setTextInput("");
    }
  };

  const handleAIAction = async (action: any) => {
    switch (action.type) {
      case 'CREATE_TASK':
        try {
          const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: action.taskName,
              listId: action.listId || userLists[0]?.id,
              duration: action.duration || "00:30"
            }),
          });

          if (response.ok) {
            await loadUserLists(); // Refresh lists
            const successMessage = `Great! I've added "${action.taskName}" to your list.`;
            addMessage('assistant', successMessage);
            speak(successMessage);
          }
        } catch (error) {
          console.error('Error creating task:', error);
        }
        break;
      
      case 'CREATE_LIST':
        try {
          const response = await fetch('/api/lists', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: action.listName,
              tag: action.tag || "General"
            }),
          });

          if (response.ok) {
            await loadUserLists(); // Refresh lists
            const successMessage = `Perfect! I've created a new list called "${action.listName}".`;
            addMessage('assistant', successMessage);
            speak(successMessage);
          }
        } catch (error) {
          console.error('Error creating list:', error);
        }
        break;
    }
  };

  const getTodayStats = () => {
    const totalTasks = userLists.reduce((acc, list) => acc + list.tasks.length, 0);
    const completedTasks = userLists.reduce((acc, list) => 
      acc + list.tasks.filter((task: any) => task.completed).length, 0
    );
    const pendingTasks = totalTasks - completedTasks;
    
    return { totalTasks, completedTasks, pendingTasks };
  };

  const stats = getTodayStats();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversation
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-zinc-800 text-zinc-100'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Transcript */}
              {currentTranscript && (
                <div className="p-4 border-t border-zinc-800 bg-zinc-800/50">
                  <p className="text-sm text-zinc-300">
                    <span className="text-zinc-500">You're saying:</span> {currentTranscript}
                  </p>
                </div>
              )}

              {/* Voice Controls */}
              <div className="p-4 border-t border-zinc-800">
                {/* Text Input */}
                <form onSubmit={handleTextSubmit} className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Type your message or use voice..."
                      className="flex-1 p-2 rounded bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim() || isLoading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
                    >
                      Send
                    </button>
                  </div>
                </form>
                
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={isLoading}
                    className={`p-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </button>
                  
                  <button
                    onClick={isSpeaking ? stopSpeaking : () => speak("How can I help you today?")}
                    disabled={isLoading}
                    className={`p-4 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSpeaking
                        ? 'bg-orange-600 hover:bg-orange-700 animate-pulse'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                    title={isSpeaking ? 'Stop speaking' : 'Test voice output'}
                  >
                    {isSpeaking ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                </div>
                
                <p className="text-center text-sm text-zinc-400 mt-2">
                  {isListening ? 
                    currentTranscript ? 
                      `Listening... "${currentTranscript}"` : 
                      'Listening... (speak now)' 
                    : isLoading ? 
                      'Processing...' : 
                      'Type or click mic to start talking'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Overview
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Tasks</span>
                  <span className="font-semibold">{stats.totalTasks}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Completed</span>
                  <span className="font-semibold text-green-400">{stats.completedTasks}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Pending</span>
                  <span className="font-semibold text-orange-400">{stats.pendingTasks}</span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-zinc-400 mb-1">
                    <span>Progress</span>
                    <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <h3 className="text-lg font-semibold mb-4">Quick Voice Commands</h3>
              
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-zinc-800 rounded">
                  <span className="text-blue-400">"What tasks do I have?"</span>
                </div>
                <div className="p-2 bg-zinc-800 rounded">
                  <span className="text-green-400">"Add a task to work list"</span>
                </div>
                <div className="p-2 bg-zinc-800 rounded">
                  <span className="text-purple-400">"Create a new list"</span>
                </div>
                <div className="p-2 bg-zinc-800 rounded">
                  <span className="text-yellow-400">"How productive was I today?"</span>
                </div>
              </div>
            </div>

            {/* Current Lists */}
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4">
              <h3 className="text-lg font-semibold mb-4">Your Lists</h3>
              
              <div className="space-y-2">
                {userLists.map((list) => (
                  <div key={list.id} className="flex justify-between items-center p-2 bg-zinc-800 rounded">
                    <span className="text-sm">{list.name}</span>
                    <span className="text-xs text-zinc-400">{list.tasks.length} tasks</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
