from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from datetime import datetime
import uvicorn

# Pydantic models for data validation
class FlashcardCreate(BaseModel):
    question: str
    answer: str

class Flashcard(BaseModel):
    id: int
    question: str
    answer: str
    created_at: str

class GameState(BaseModel):
    board: List[int]
    current_player: int
    game_active: bool
    flashcards_used: List[int]

# Initialize FastAPI app
app = FastAPI(
    title="MatchMind API",
    description="Backend API for MatchMind - A Tic-Tac-Toe Flashcard Game",
    version="1.0.0"
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ivan-web-source.github.io/"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage (in production, use a proper database)
DATA_FILE = "matchmind_data.json"
flashcards_data = []
game_states = {}
next_id = 1

# Utility functions
def load_data():
    """Load data from JSON file"""
    global flashcards_data, next_id
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                data = json.load(f)
                flashcards_data = data.get('flashcards', [])
                next_id = data.get('next_id', 1)
        else:
            flashcards_data = []
            next_id = 1
    except Exception as e:
        print(f"Error loading data: {e}")
        flashcards_data = []
        next_id = 1

def save_data():
    """Save data to JSON file"""
    try:
        data = {
            'flashcards': flashcards_data,
            'next_id': next_id
        }
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Error saving data: {e}")

def get_current_timestamp():
    """Get current timestamp as string"""
    return datetime.now().isoformat()

# Load data on startup
load_data()

# API Routes

@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "MatchMind API is running!",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "flashcards": "/flashcards",
            "game_state": "/game-state",
            "docs": "/docs"
        }
    }

@app.get("/flashcards", response_model=List[Flashcard])
async def get_flashcards():
    """Get all flashcards"""
    return flashcards_data

@app.post("/flashcards", response_model=Flashcard)
async def create_flashcard(flashcard: FlashcardCreate):
    """Create a new flashcard"""
    global next_id
    
    if not flashcard.question.strip() or not flashcard.answer.strip():
        raise HTTPException(status_code=400, detail="Question and answer cannot be empty")
    
    new_flashcard = {
        "id": next_id,
        "question": flashcard.question.strip(),
        "answer": flashcard.answer.strip(),
        "created_at": get_current_timestamp()
    }
    
    flashcards_data.append(new_flashcard)
    next_id += 1
    save_data()
    
    return new_flashcard

@app.get("/flashcards/{flashcard_id}", response_model=Flashcard)
async def get_flashcard(flashcard_id: int):
    """Get a specific flashcard by ID"""
    flashcard = next((card for card in flashcards_data if card["id"] == flashcard_id), None)
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return flashcard

@app.put("/flashcards/{flashcard_id}", response_model=Flashcard)
async def update_flashcard(flashcard_id: int, flashcard: FlashcardCreate):
    """Update a flashcard"""
    for i, card in enumerate(flashcards_data):
        if card["id"] == flashcard_id:
            if not flashcard.question.strip() or not flashcard.answer.strip():
                raise HTTPException(status_code=400, detail="Question and answer cannot be empty")
            
            flashcards_data[i]["question"] = flashcard.question.strip()
            flashcards_data[i]["answer"] = flashcard.answer.strip()
            save_data()
            return flashcards_data[i]
    
    raise HTTPException(status_code=404, detail="Flashcard not found")

@app.delete("/flashcards/{flashcard_id}")
async def delete_flashcard(flashcard_id: int):
    """Delete a flashcard"""
    global flashcards_data
    original_length = len(flashcards_data)
    flashcards_data = [card for card in flashcards_data if card["id"] != flashcard_id]
    
    if len(flashcards_data) == original_length:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    
    save_data()
    return {"message": "Flashcard deleted successfully"}

@app.post("/flashcards/bulk")
async def create_bulk_flashcards(flashcards: List[FlashcardCreate]):
    """Create multiple flashcards at once"""
    global next_id
    created_cards = []
    
    for flashcard in flashcards:
        if flashcard.question.strip() and flashcard.answer.strip():
            new_flashcard = {
                "id": next_id,
                "question": flashcard.question.strip(),
                "answer": flashcard.answer.strip(),
                "created_at": get_current_timestamp()
            }
            flashcards_data.append(new_flashcard)
            created_cards.append(new_flashcard)
            next_id += 1
    
    save_data()
    return {"created": len(created_cards), "flashcards": created_cards}

@app.delete("/flashcards")
async def delete_all_flashcards():
    """Delete all flashcards (use with caution!)"""
    global flashcards_data
    deleted_count = len(flashcards_data)
    flashcards_data = []
    save_data()
    return {"message": f"Deleted {deleted_count} flashcards"}

# Game state management
@app.post("/game-state/{session_id}")
async def save_game_state(session_id: str, game_state: GameState):
    """Save game state for a session"""
    game_states[session_id] = {
        "board": game_state.board,
        "current_player": game_state.current_player,
        "game_active": game_state.game_active,
        "flashcards_used": game_state.flashcards_used,
        "last_updated": get_current_timestamp()
    }
    return {"message": "Game state saved"}

@app.get("/game-state/{session_id}")
async def get_game_state(session_id: str):
    """Get game state for a session"""
    if session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game state not found")
    return game_states[session_id]

@app.delete("/game-state/{session_id}")
async def delete_game_state(session_id: str):
    """Delete game state for a session"""
    if session_id not in game_states:
        raise HTTPException(status_code=404, detail="Game state not found")
    del game_states[session_id]
    return {"message": "Game state deleted"}

# Statistics endpoints
@app.get("/stats")
async def get_stats():
    """Get basic statistics about the API usage"""
    return {
        "total_flashcards": len(flashcards_data),
        "active_game_sessions": len(game_states),
        "api_version": "1.0.0",
        "server_time": get_current_timestamp()
    }

@app.get("/flashcards/search/{query}")
async def search_flashcards(query: str):
    """Search flashcards by question or answer content"""
    query_lower = query.lower()
    results = [
        card for card in flashcards_data 
        if query_lower in card["question"].lower() or query_lower in card["answer"].lower()
    ]
    return results

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": get_current_timestamp(),
        "data_file_exists": os.path.exists(DATA_FILE),
        "flashcards_count": len(flashcards_data)
    }

# Error handlers
@app.exception_handler(404)
async def not_found_exception_handler(request, exc):
    return {"error": "Resource not found"}

@app.exception_handler(500)
async def internal_error_exception_handler(request, exc):
    return {"error": "Internal server error"}

# Serve static files (for development)
# In production, use a proper web server like Nginx
if os.path.exists("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    print("🚀 Starting MatchMind API Server...")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🎮 MatchMind Game: http://localhost:8000/static/index.html")
    print("💾 Data will be stored in:", DATA_FILE)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload for development
        log_level="info"
    )