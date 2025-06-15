import psycopg2
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv
import uuid 
# Load .env file (if using)
load_dotenv()

# Example AI tool data
tools = [    
    # Knowledge management and AI grounding
    {
        "name": "Mem",
        "description": "An AI-powered note-taking app that automatically organizes and connects your thoughts and information.",
        "link": "https://mem.ai"
    },
    {
        "name": "Notion AI Q&A",
        "description": "AI-powered question answering within Notion workspaces for knowledge discovery and insights.",
        "link": "https://notion.so"
    },
    {
        "name": "Personal AI",
        "description": "A personal AI assistant trained on your own data to provide personalized responses and insights.",
        "link": "https://personal.ai"
    },
    
    # Task and project management
    {
        "name": "Asana",
        "description": "A project management platform with AI features for task prioritization and workflow optimization.",
        "link": "https://asana.com"
    },
    {
        "name": "Any.do",
        "description": "A task management app with AI-powered planning and scheduling capabilities.",
        "link": "https://any.do"
    },
    {
        "name": "BeeDone",
        "description": "A gamified productivity app that uses AI to help manage tasks and build habits.",
        "link": "https://beedone.co"
    },
    
    # Transcription and meeting assistants
    {
        "name": "Fireflies",
        "description": "An AI meeting assistant that records, transcribes, and summarizes meetings automatically.",
        "link": "https://fireflies.ai"
    },
    {
        "name": "Avoma",
        "description": "A meeting intelligence platform that provides AI-powered conversation insights and analytics.",
        "link": "https://avoma.com"
    },
    {
        "name": "tl;dv",
        "description": "An AI-powered meeting recorder that creates summaries and highlights key moments from calls.",
        "link": "https://tldv.io"
    },
    
    # Scheduling
    {
        "name": "Reclaim",
        "description": "An AI scheduling assistant that automatically blocks time for tasks and protects focus time.",
        "link": "https://reclaim.ai"
    },
    {
        "name": "Clockwise",
        "description": "An AI-powered time management tool that creates focused work schedules and reduces meeting fatigue.",
        "link": "https://clockwise.com"
    },
    {
        "name": "Motion",
        "description": "An AI calendar and task manager that automatically schedules and prioritizes your work.",
        "link": "https://usemotion.com"
    },
    
    # Email
    {
        "name": "Shortwave",
        "description": "An AI-powered email client that helps organize, prioritize, and compose emails efficiently.",
        "link": "https://shortwave.com"
    },
    {
        "name": "Microsoft Copilot Pro for Outlook",
        "description": "AI assistant integrated into Outlook for email composition, summarization, and management.",
        "link": "https://copilot.microsoft.com"
    },
    {
        "name": "Gemini for Gmail",
        "description": "Google's AI assistant that helps write, summarize, and organize emails within Gmail.",
        "link": "https://gemini.google.com"
    },
    
    # Presentation tools
    {
        "name": "Tome",
        "description": "An AI-powered presentation tool that generates slides and content from simple prompts.",
        "link": "https://tome.app"
    },
    {
        "name": "Beautiful.ai",
        "description": "A presentation platform with AI-powered design that automatically creates professional slides.",
        "link": "https://beautiful.ai"
    },
    {
        "name": "Slidesgo",
        "description": "A presentation template platform with AI features for customizing and generating slide content.",
        "link": "https://slidesgo.com"
    },
    
    # Resume builders
    {
        "name": "Teal",
        "description": "An AI-powered career platform that helps build resumes and optimize job applications.",
        "link": "https://tealhq.com"
    },
    {
        "name": "Enhancv",
        "description": "A resume builder with AI suggestions for content optimization and design improvements.",
        "link": "https://enhancv.com"
    },
    {
        "name": "Kickresume",
        "description": "An AI resume builder that creates professional resumes and cover letters with smart suggestions.",
        "link": "https://kickresume.com"
    },
    
    # Automation
    {
        "name": "Zapier",
        "description": "An automation platform that connects apps and services to create AI-powered workflows and integrations.",
        "link": "https://zapier.com"
    }
]
# Initialize the embedding model (384-dim)
model = SentenceTransformer('all-MiniLM-L6-v2')

# Get database URL from .env
DB_URL = os.getenv("DATABASE_URL")

# Connect to PostgreSQL
conn = psycopg2.connect(DB_URL)
cur = conn.cursor()

# Insert each tool
for tool in tools:
    name = tool["name"]
    desc = tool["description"]
    link = tool["link"] if "link" in tool else None
    tool_id = str(uuid.uuid4())
    embedding = model.encode(desc).tolist()  # Convert numpy array to Python list

    # Insert using SQL
    cur.execute(
        "INSERT INTO tools (id, name, description, link, embedding) VALUES (%s, %s, %s, %s, %s)",
        (tool_id, name, desc, link, embedding)
    )

# Commit & close
try:
    for tool in tools:
        embedding = model.encode(tool["description"]).tolist()
        cur.execute(
            """
            INSERT INTO tools (id, name, description, link, embedding)
            VALUES (gen_random_uuid(), %s, %s, %s, %s)
            """,
            (tool["name"], tool["description"], tool["link"], embedding)
        )
    conn.commit()
    print("Inserted sample tools")

except Exception as e:
    conn.rollback()
    print("Failed to insert:", e)
print("Inserted embeddings successfully.")
