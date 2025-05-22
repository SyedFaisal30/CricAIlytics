from fastapi import FastAPI
from pydantic import BaseModel
from controller.gemini_handler import get_player_stats
app = FastAPI(
    title="🏏 CricAI - Cricket Stats Assistant",
    description="Get detailed AI-powered stats of any cricketer using Gemini.",
    version="1.0.0"
)

class PlayerRequest(BaseModel):
    player_name: str

@app.post("/analyze-player/")
def analyze_player(req: PlayerRequest):
    
    stats = get_player_stats(req.player_name)
    return {"result": stats}