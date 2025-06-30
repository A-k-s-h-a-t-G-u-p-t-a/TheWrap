import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Groq from "groq-sdk";

// Type definitions
interface UserList {
  id: string;
  name: string;
  tasks: Array<{
    id: string;
    name: string;
    completed?: boolean;
  }>;
}

interface Context {
  totalTasks: number;
  pendingTasks: number;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, userLists, context } = await request.json();

    // Check if GROQ_API_KEY is available
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        response: "AI service is currently unavailable. Please try again later.",
        action: null
      });
    }

    // Analyze the user's message and determine intent
    const aiResponse = await generateAIResponse(message, userLists, context);

    return NextResponse.json(aiResponse);
  } catch (error) {
    console.error("Error in AI assistant:", error);
    return NextResponse.json({
      response: "Sorry, I'm having trouble right now. Please try again later.",
      action: null
    });
  }
}

async function generateAIResponse(message: string, userLists: UserList[], context: Context) {
  // During build time, return a fallback response
  if (process.env.NODE_ENV === 'production' && !process.env.GROQ_API_KEY) {
    return {
      response: "AI service is currently being configured. Please try again later.",
      action: null
    };
  }

  // Initialize Groq client
  let groq;
  try {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  } catch (error) {
    console.error("Failed to initialize Groq client:", error);
    return {
      response: "AI service is currently unavailable. Please try again later.",
      action: null
    };
  }

  // Prepare context for the AI
  const listsContext = userLists.map(list => ({
    id: list.id,
    name: list.name,
    tasks: list.tasks.map((task: any) => ({
      id: task.id,
      name: task.name,
      completed: task.completed
    }))
  }));

  const pendingTasks = userLists.flatMap(list => 
    list.tasks.filter((task: any) => !task.completed)
      .map((task: any) => `${task.name} (in ${list.name})`)
  );

  const completedToday = context.totalTasks - context.pendingTasks;
  const completionRate = context.totalTasks > 0 ? Math.round((completedToday / context.totalTasks) * 100) : 0;

  const systemPrompt = `You are a helpful AI day planner assistant. You help users manage their tasks and productivity.

Current user context:
- Total tasks: ${context.totalTasks}
- Pending tasks: ${context.pendingTasks}
- Completion rate today: ${completionRate}%
- Available lists: ${userLists.map(l => l.name).join(", ")}
- Pending tasks: ${pendingTasks.length > 0 ? pendingTasks.join(", ") : "None"}

You can perform these actions:
1. CREATE_TASK - Add a new task to a specific list
2. CREATE_LIST - Create a new list
3. VIEW_TASKS - Show pending tasks
4. PRODUCTIVITY_STATS - Show productivity information
5. GENERAL_HELP - Provide general assistance

When the user wants to add a task, extract the task name and determine which list it should go to.
When the user wants to create a list, extract the list name.

Always respond with a JSON object containing:
- "response": A friendly, conversational response to the user
- "action": An optional action object with "type" and relevant parameters

Be conversational, encouraging, and helpful. Use emojis occasionally to make interactions more engaging.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const aiResponseText = completion.choices[0]?.message?.content;
    if (!aiResponseText) {
      throw new Error("No response from AI");
    }

    let aiResponse;
    try {
      aiResponse = JSON.parse(aiResponseText);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponseText);
      // Fallback response
      return {
        response: "I'm here to help you stay productive! I can help you view your tasks, add new ones, create lists, check your progress, or plan your day. What would you like to do?"
      };
    }

    // Process the action if one was determined
    if (aiResponse.action) {
      switch (aiResponse.action.type) {
        case "CREATE_TASK":
          // Validate and enhance the task creation action
          const taskName = aiResponse.action.taskName || extractTaskName(message);
          const targetList = aiResponse.action.listId 
            ? userLists.find(l => l.id === aiResponse.action.listId)
            : extractListName(message, userLists) || userLists[0];

          if (taskName && targetList) {
            aiResponse.action = {
              type: "CREATE_TASK",
              taskName,
              listId: targetList.id,
              duration: aiResponse.action.duration || "00:30"
            };
          } else {
            // Remove action if we can't determine the details
            delete aiResponse.action;
            aiResponse.response = "I'd be happy to add a task for you! Could you tell me the task name and which list you'd like to add it to? For example, 'Add write report to work list'.";
          }
          break;

        case "CREATE_LIST":
          const listName = aiResponse.action.listName || extractNewListName(message);
          if (listName) {
            aiResponse.action = {
              type: "CREATE_LIST",
              listName,
              tag: aiResponse.action.tag || "General"
            };
          } else {
            delete aiResponse.action;
            aiResponse.response = "I can create a new list for you! What would you like to name it? You could say something like 'Create a shopping list' or 'Make a workout list'.";
          }
          break;

        case "VIEW_TASKS":
          // Handle task viewing
          if (pendingTasks.length === 0) {
            aiResponse.response = "Great news! You don't have any pending tasks right now. You're all caught up! 🎉 Would you like me to help you add some new tasks or create a new list?";
          } else {
            const taskList = pendingTasks.slice(0, 5).join(", ");
            const moreCount = pendingTasks.length > 5 ? ` and ${pendingTasks.length - 5} more` : "";
            aiResponse.response = `You have ${pendingTasks.length} pending tasks: ${taskList}${moreCount}. Would you like me to help you prioritize them or add a new task?`;
          }
          delete aiResponse.action; // No server action needed for viewing
          break;

        case "PRODUCTIVITY_STATS":
          let motivationalMessage = "";
          if (completionRate >= 80) {
            motivationalMessage = "Excellent work! You're crushing it today! 🎉";
          } else if (completionRate >= 50) {
            motivationalMessage = "You're doing great! Keep up the momentum! 💪";
          } else if (completionRate >= 25) {
            motivationalMessage = "Good progress! You're on the right track! 👍";
          } else {
            motivationalMessage = "Every step counts! Let's tackle some tasks together! 🚀";
          }

          aiResponse.response = `Today you've completed ${completedToday} out of ${context.totalTasks} tasks (${completionRate}% completion rate). ${motivationalMessage} Would you like me to help you prioritize your remaining tasks?`;
          delete aiResponse.action; // No server action needed for stats
          break;
      }
    }

    return aiResponse;

  } catch (error) {
    console.error("Error calling Groq API:", error);
    
    // Fallback to basic pattern matching if Groq fails
    return fallbackResponse(message, userLists, context);
  }
}

// Fallback function for when Groq API is unavailable
function fallbackResponse(message: string, userLists: any[], context: any) {
  const lowerMessage = message.toLowerCase();

  // Basic intent detection as fallback
  if (lowerMessage.includes("what tasks") || lowerMessage.includes("tasks do i have") || lowerMessage.includes("show me tasks")) {
    const pendingTasks = userLists.flatMap(list => 
      list.tasks.filter((task: any) => !task.completed)
        .map((task: any) => `${task.name} (${list.name})`)
    );

    if (pendingTasks.length === 0) {
      return {
        response: "Great news! You don't have any pending tasks right now. You're all caught up! Would you like me to help you add some new tasks or create a new list?"
      };
    }

    const taskList = pendingTasks.slice(0, 5).join(", ");
    const moreCount = pendingTasks.length > 5 ? ` and ${pendingTasks.length - 5} more` : "";
    
    return {
      response: `You have ${pendingTasks.length} pending tasks: ${taskList}${moreCount}. Would you like me to help you prioritize them or add a new task?`
    };
  }

  if (lowerMessage.includes("add task") || lowerMessage.includes("create task") || lowerMessage.includes("new task")) {
    const taskName = extractTaskName(message);
    const targetList = extractListName(message, userLists) || userLists[0];

    if (taskName && targetList) {
      return {
        response: `I'll add "${taskName}" to your ${targetList.name} list right away!`,
        action: {
          type: "CREATE_TASK",
          taskName,
          listId: targetList.id,
          duration: "00:30"
        }
      };
    }
  }

  return {
    response: "I'm here to help you stay productive! I can help you view your tasks, add new ones, create lists, check your progress, or plan your day. What would you like to do?"
  };
}

function extractTaskName(message: string): string | null {
  // Simple extraction - look for patterns like "add [task] to [list]"
  const patterns = [
    /add\s+(.+?)\s+to\s+/i,
    /create\s+task\s+(.+)/i,
    /new\s+task\s+(.+)/i,
    /add\s+(.+)/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}

function extractListName(message: string, userLists: any[]): any | null {
  const lowerMessage = message.toLowerCase();

  // Check if user mentioned an existing list
  for (const list of userLists) {
    if (lowerMessage.includes(list.name.toLowerCase())) {
      return list;
    }
  }

  return null;
}

function extractNewListName(message: string): string | null {
  // Extract new list name patterns
  const patterns = [
    /create\s+(?:a\s+)?(.+?)\s+list/i,
    /make\s+(?:a\s+)?(.+?)\s+list/i,
    /new\s+(.+?)\s+list/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }

  return null;
}
