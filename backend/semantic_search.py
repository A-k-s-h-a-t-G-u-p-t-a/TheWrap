import psycopg2
from psycopg2 import pool
from sentence_transformers import SentenceTransformer
import os
from dotenv import load_dotenv

load_dotenv()

# Create a connection pool instead of a single connection
connection_pool = pool.SimpleConnectionPool(
    1, 10,  # min, max connections
    os.getenv("DATABASE_URL")
)

# Load embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Semantic search function
def semantic_search(query, top_k=5):
    # Get a connection from the pool
    conn = connection_pool.getconn()
    try:
        # Create a cursor for this connection
        with conn.cursor() as cur:
            embedding = model.encode(query).tolist()
            
            # Keep vector in the format pgvector expects (with square brackets)
            embedding_str = str(embedding)  
            
            query_sql = f"""
            SELECT id, name, description, link
            FROM tools
            ORDER BY embedding <-> '{embedding_str}'::vector
            LIMIT {top_k}
            """
            cur.execute(query_sql)
            results = cur.fetchall()
            return [{"id": r[0], "name": r[1], "description": r[2], "link": r[3]} for r in results]
    finally:
        # Always return the connection to the pool
        connection_pool.putconn(conn)

# Run the search
if __name__ == "__main__":
    results = semantic_search("an app that lets me build resumes with AI suggestions", top_k=5)
    for r in results:
        print(r)
