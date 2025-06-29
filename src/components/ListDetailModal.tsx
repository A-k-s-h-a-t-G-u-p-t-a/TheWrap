"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, Play, Pause, Square } from "lucide-react";

interface Task {
  id: string;
  name: string;
  duration: string;
  completed?: boolean;
  completedAt?: Date;
}

interface ListDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  list: {
    id: string;
    name: string;
    tag: string;
    tasks: Task[];
  } | null;
  onTaskUpdate?: () => void;
}

export default function ListDetailModal({ isOpen, onClose, list, onTaskUpdate }: ListDetailModalProps) {
  const [timerRunning, setTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);

  // Sync local tasks with the list prop
  useEffect(() => {
    if (list?.tasks) {
      setLocalTasks(list.tasks);
    }
  }, [list]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && selectedTask) {
      interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, selectedTask]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTimer = (task: Task) => {
    setSelectedTask(task);
    setCurrentTime(0);
    setTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setTimerRunning(false);
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
    setCurrentTime(0);
    setSelectedTask(null);
  };

  const handleMarkDone = async (taskId: string) => {
    try {
      // Optimistically update the UI
      setLocalTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed, completedAt: !task.completed ? new Date() : undefined }
          : task
      ));

      const taskToToggle = localTasks.find(task => task.id === taskId);
      const newCompletedState = !taskToToggle?.completed;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: newCompletedState }),
      });

      if (!response.ok) {
        // Revert the optimistic update on error
        setLocalTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, completed: taskToToggle?.completed || false, completedAt: taskToToggle?.completedAt }
            : task
        ));
        throw new Error("Failed to update task");
      }

      // Call the callback to refresh the list data
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task. Please try again.");
    }
  };

  if (!list) return null;

  // Filter tasks for today and done using local state
  const today = new Date().toDateString();
  const todayTasks = localTasks.filter(task => !task.completed);
  const doneTasks = localTasks.filter(task => task.completed);

  const totalTodayTime = todayTasks.reduce((acc, task) => {
    const [h, m] = task.duration.split(":").map(Number);
    return acc + h * 60 + m;
  }, 0);

  const completedTodayTasks = doneTasks.filter(task => 
    task.completedAt && new Date(task.completedAt).toDateString() === today
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-zinc-900 rounded-xl w-full max-w-4xl h-[80vh] text-white overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-zinc-700">
            <div className="flex items-center gap-3">
              <span className="bg-zinc-700 text-white px-3 py-1 rounded-lg text-sm font-bold">
                {list.tag}
              </span>
              <Dialog.Title className="text-2xl font-bold">{list.name}</Dialog.Title>
            </div>
            <button onClick={onClose}>
              <X className="text-zinc-400 hover:text-white w-6 h-6" />
            </button>
          </div>

          <div className="flex h-full">
            {/* Today Tasks - Left Side */}
            <div className="flex-1 p-6 border-r border-zinc-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-lime-400">Today</h2>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">{formatTime(totalTodayTime * 60)} total</div>
                  <button className="text-lime-400 text-sm">+ ADD TASK</button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-zinc-400 mb-2">
                  <span>{completedTodayTasks.length}/{todayTasks.length + completedTodayTasks.length} Done</span>
                </div>
                <div className="w-full bg-zinc-800 h-2 rounded-full">
                  <div 
                    className="bg-lime-400 h-2 rounded-full transition-all"
                    style={{ 
                      width: `${((completedTodayTasks.length / (todayTasks.length + completedTodayTasks.length)) * 100) || 0}%` 
                    }}
                  />
                </div>
              </div>

              {/* Today Tasks List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {todayTasks.map((task, index) => (
                  <div key={task.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={task.completed || false}
                        onChange={() => handleMarkDone(task.id)}
                        className="w-4 h-4 text-lime-400 bg-zinc-700 border-zinc-600 rounded focus:ring-lime-400 focus:ring-2"
                      />
                      <span className="text-zinc-400 font-mono text-sm">{index + 1}</span>
                      <div>
                        <p className={`font-medium ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                          {task.name}
                        </p>
                        <p className="text-sm text-zinc-400">{task.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-400">0min</span>
                      <button 
                        onClick={() => handleMarkDone(task.id)}
                        className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      >
                        M
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timer Section */}
              <div className="mt-6 pt-4 border-t border-zinc-700">
                {selectedTask ? (
                  <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-zinc-400">Working on:</p>
                      <p className="font-medium">{selectedTask.name}</p>
                      <p className="text-3xl font-mono text-lime-400 mt-2">
                        {formatTime(currentTime)}
                      </p>
                    </div>
                    <div className="flex justify-center gap-2">
                      {timerRunning ? (
                        <button
                          onClick={handlePauseTimer}
                          className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Pause className="w-4 h-4" />
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => setTimerRunning(true)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Resume
                        </button>
                      )}
                      <button
                        onClick={handleStopTimer}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <Square className="w-4 h-4" />
                        Stop
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => todayTasks.length > 0 && handleStartTimer(todayTasks[0])}
                    disabled={todayTasks.length === 0}
                    className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    🚀 Add Timer
                  </button>
                )}
              </div>
            </div>

            {/* Done Tasks - Right Side */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Done</h2>
                <span className="text-sm text-zinc-400">
                  {completedTodayTasks.length} task{completedTodayTasks.length !== 1 ? 's' : ''} this month
                </span>
              </div>

              {/* Today's Completed Tasks */}
              <div className="mb-6">
                <h3 className="text-zinc-400 text-sm mb-3">Sun, Jun 29, 2025</h3>
                <div className="space-y-2">
                  {completedTodayTasks.map((task) => (
                    <div key={task.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed || false}
                          onChange={() => handleMarkDone(task.id)}
                          className="w-4 h-4 text-lime-400 bg-zinc-700 border-zinc-600 rounded focus:ring-lime-400 focus:ring-2"
                        />
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <p className="line-through text-zinc-400">{task.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">0min</span>
                        <button 
                          onClick={() => handleMarkDone(task.id)}
                          className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        >
                          M
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {completedTodayTasks.length === 0 && (
                    <div className="text-center text-zinc-500 py-8">
                      No completed tasks today
                    </div>
                  )}
                </div>
              </div>

              {/* All Done Tasks */}
              <div className="max-h-64 overflow-y-auto">
                <h3 className="text-zinc-400 text-sm mb-3">All Completed Tasks</h3>
                <div className="space-y-2">
                  {doneTasks.filter(task => 
                    !task.completedAt || new Date(task.completedAt).toDateString() !== today
                  ).map((task) => (
                    <div key={task.id} className="bg-zinc-800 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={task.completed || false}
                          onChange={() => handleMarkDone(task.id)}
                          className="w-4 h-4 text-lime-400 bg-zinc-700 border-zinc-600 rounded focus:ring-lime-400 focus:ring-2"
                        />
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <p className="line-through text-zinc-400">{task.name}</p>
                          <p className="text-xs text-zinc-500">
                            {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'Completed'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400">0min</span>
                        <button 
                          onClick={() => handleMarkDone(task.id)}
                          className="bg-blue-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        >
                          M
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
