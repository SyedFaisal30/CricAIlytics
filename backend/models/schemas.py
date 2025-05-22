from pydantic import BaseModel

class PlayerRequest(BaseModel):
    player_name: str
