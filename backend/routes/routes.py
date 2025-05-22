from fastapi import APIRouter
from models.schemas import PlayerRequest
from controller.gemini_handler import get_player_stats

router = APIRouter()

@router.post("/analyze-player/")
def analyze_player(req: PlayerRequest):
    stats = get_player_stats(req.player_name)
    return {"result": stats}
