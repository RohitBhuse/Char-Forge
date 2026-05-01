from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime, date
from uuid import UUID

class WorldBase(BaseModel):
    world_name: str
    world_description: Optional[str] = None

class WorldCreate(WorldBase):
    world_timeline: Optional[str] = None
    attribute_list: Optional[str] = None

class WorldUpdate(BaseModel):
    world_name: Optional[str] = None
    world_description: Optional[str] = None
    world_timeline: Optional[str] = None
    attribute_list: Optional[str] = None

class WorldAttributeUpdate(BaseModel):
    attribute_list: str

class World(WorldBase):
    world_id: int
    user_id: UUID
    world_timeline: Optional[date] = None
    attribute_list: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
