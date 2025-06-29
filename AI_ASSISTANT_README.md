# AI Assistant Setup

This AI assistant uses Groq's LLM API for intelligent intent parsing and natural conversation.

## Setup

1. Get a Groq API key from [console.groq.com](https://console.groq.com)
2. Copy `.env.example` to `.env.local`
3. Replace `your_groq_api_key_here` with your actual Groq API key
4. Start the development server: `npm run dev`

## Features

The AI assistant can:
- Parse natural language commands using Groq's LLM
- Add tasks to specific lists by voice or text
- Create new lists
- Show productivity statistics
- List pending tasks
- Hold natural conversations about productivity

## Environment Variables

Required environment variables in `.env.local`:

```
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Usage Examples

Try saying or typing:
- "What tasks do I have today?"
- "Add buy groceries to my shopping list"
- "Create a new workout list"
- "How productive have I been today?"
- "Add meeting with John to work list"

The AI will understand your intent and take appropriate actions!
