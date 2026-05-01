from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any
from app.models.character import CharacterStatus

class CharacterBase(BaseModel):
    character_name: str
    character_attribute: Optional[Dict[str, Any]] = None
    status: CharacterStatus = CharacterStatus.New
    universe_id: int
    world_id: int
    tags: Optional[str] = None

class CharacterCreate(CharacterBase):
    pass

class CharacterUpdate(BaseModel):
    tags: Optional[str] = None
    character_attribute: Optional[Dict[str, Any]] = None

class Character(CharacterBase):
    character_id: int
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
