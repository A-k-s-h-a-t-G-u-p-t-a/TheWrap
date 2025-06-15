from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from semantic_search import semantic_search

app = FastAPI()

# CORS: Allow Next.js frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace * with exact domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/search")
def search_tools(q: str = Query(...)):
    result = semantic_search(q)
    for r in result:
        print(r)
    return {"data": result}
