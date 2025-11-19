# 🎯 TheWrap - AI-Powered Task Management & Productivity Suite

[![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.10.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

> **TheWrap** is a modern, AI-powered productivity suite that combines task management, intelligent planning, and creative tools in one seamless platform. Built with cutting-edge technologies and designed for the future of work.

## ✨ Features

### 🤖 AI-Powered Assistant
- **Voice & Text Interaction**: Natural conversation with your AI day planner
- **Smart Task Creation**: Automatically extract tasks from voice commands
- **Productivity Analytics**: Get insights on your daily completion rates
- **Context-Aware Responses**: AI understands your current workload and priorities

### 📋 Advanced Task Management
- **Drag & Drop Interface**: Intuitive task organization
- **Multiple Lists**: Organize tasks by projects, categories, or priorities
- **Time Tracking**: Duration estimates and completion tracking
- **Progress Visualization**: Beautiful charts and completion rates

### 🎨 Creative Canvas
- **Excalidraw Integration**: Sketch, brainstorm, and visualize ideas
- **AI Summarization**: Convert drawings and notes into actionable tasks
- **Real-time Collaboration**: Share and work together on visual projects

### 🔐 Secure Authentication
- **NextAuth.js**: Secure user authentication and session management
- **Database Integration**: Persistent user data with Prisma ORM
- **Role-based Access**: Secure API endpoints and user data

### 🎯 Smart Search & Discovery
- **Vector Search**: Semantic search powered by embeddings
- **AI Tool Directory**: Discover and explore cutting-edge AI tools
- **Intelligent Recommendations**: Personalized tool suggestions

## 🚀 Tech Stack

### Frontend
- **[Next.js 15.3.2](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations
- **[Shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components

### Backend & Database
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js
- **[FastAPI](https://fastapi.tiangolo.com/)** - High-performance Python API

### AI & ML
- **[Groq](https://groq.com/)** - Ultra-fast AI inference
- **[OpenAI Embeddings](https://openai.com/)** - Vector search capabilities
- **[Speech Recognition API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)** - Voice interaction
- **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)** - Text-to-speech

### Creative Tools
- **[Excalidraw](https://excalidraw.com/)** - Hand-drawn style diagrams
- **[Simplex Noise](https://github.com/jwagner/simplex-noise.js)** - Procedural animations

## 🛠️ Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ (for FastAPI backend)
- **PostgreSQL** database
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/thewrap.git
cd thewrap
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies (if running separately)
cd backend
pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/thewrap"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# AI Services
GROQ_API_KEY="your-groq-api-key"
OPENAI_API_KEY="your-openai-api-key"

# Optional: External Services
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Development

```bash
# Start the Next.js development server
npm run dev

# Start the FastAPI backend (in separate terminal)
cd backend
uvicorn main:app --reload --port 8000
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
thewrap/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (pages)/           # Main application pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── ui/               # Base UI components
│   │   └── ...               # Feature-specific components
│   ├── lib/                  # Utility functions and configurations
│   └── types/                # TypeScript type definitions
├── backend/                  # FastAPI backend (optional)
├── prisma/                   # Database schema and migrations
├── public/                   # Static assets
└── scripts/                  # Utility scripts
```

## 🎯 Key Features Guide

### Voice-Powered AI Assistant

```bash
# Try these voice commands:
"What tasks do I have today?"
"Add write report to work list"
"Create a new list called Personal"
"How productive was I this week?"
```

### Task Management

- **Create Lists**: Organize tasks by project or category
- **Drag & Drop**: Reorder tasks and move between lists
- **Time Tracking**: Set duration estimates for better planning
- **Completion Tracking**: Mark tasks as done and track progress

### Creative Canvas

- **Brainstorm**: Use the integrated drawing canvas for visual thinking
- **AI Summary**: Convert sketches and notes into actionable tasks
- **Export**: Save your creations and share with others

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npx prisma studio       # Open Prisma Studio
npx prisma db push      # Push schema changes
npx prisma generate     # Generate Prisma client
```

## 🚀 Deployment

### Vercel (Recommended for Frontend)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy with one click

### Railway/Render (Backend)

1. Set Root Directory to `backend`
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Vercel](https://vercel.com)** - Deployment platform
- **[Shadcn](https://twitter.com/shadcn)** - UI component inspiration
- **[Aceternity UI](https://ui.aceternity.com/)** - Beautiful component library
- **[Framer](https://www.framer.com/)** - Animation library

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please create an issue on our [GitHub Issues](https://github.com/your-username/thewrap/issues) page.

## 📞 Support

Need help? Reach out to us:
- 📧 Email: support@thewrap.ai
- 🐦 Twitter: [@thewrap_ai](https://twitter.com/thewrap_ai)
- 💬 Discord: [Join our community](https://discord.gg/thewrap)

---

<div align="center">
  <p>Built with ❤️ by the TheWrap team</p>
  <p>
    <a href="https://the-wrap.vercel.app">🌐 Live Demo</a> •
    <a href="#getting-started">📖 Documentation</a> •
    <a href="https://github.com/your-username/thewrap/issues">🐛 Report Bug</a>
  </p>
</div>