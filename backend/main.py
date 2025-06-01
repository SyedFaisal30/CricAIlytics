from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from controller.gemini_handler import get_player_stats

app = FastAPI(
    title="🏏 CricAI - Cricket Stats Assistant",
    description="Get detailed AI-powered stats of any cricketer using Gemini.",
    version="1.0.0"
)

origins = [
    "https://cricailytics.vercel.app","http://localhost:5173", "https://123lms00-5173.inc1.devtunnels.ms"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,         
    allow_credentials=True,
    allow_methods=["*"],           
    allow_headers=["*"],           
)

class PlayerRequest(BaseModel):
    player_name: str

@app.post("/analyze-player/")
def analyze_player(req: PlayerRequest):
    stats = get_player_stats(req.player_name)
    return {"result": stats}
