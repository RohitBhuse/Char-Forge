from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from .world import World

class UniverseBase(BaseModel):
    universe_name: str
    universe_description: Optional[str] = None

class UniverseCreate(UniverseBase):
    pass

class Universe(UniverseBase):
    universe_id: int
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

class UniverseTree(Universe):
    worlds: List[World] = []

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
