from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, Dict, Any
from app.models.character import CharacterStatus

class CharacterBase(BaseModel):
    character_name: str
    core_description: Optional[str] = None
    universe_id: int

class CharacterCreate(CharacterBase):
    pass

class Character(CharacterBase):
    character_id: int
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class CharacterVariantBase(BaseModel):
    variant_name: str
    attributes: Optional[Dict[str, Any]] = None
    status: CharacterStatus = CharacterStatus.New
    world_id: int

class CharacterVariantCreate(CharacterVariantBase):
    character_id: int

class CharacterVariant(CharacterVariantBase):
    variant_id: int
    character_id: int
    created_at: datetime
    updated_at: datetime

    # Legacy support
    character_name: Optional[str] = None
    character_attribute: Optional[dict] = None

    class Config:
        from_attributes = True

class CharacterUpdate(BaseModel):
    character_name: Optional[str] = None
    core_description: Optional[str] = None

class CharacterVariantUpdate(BaseModel):
    variant_name: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None
    status: Optional[CharacterStatus] = None

class CharacterRelationshipBase(BaseModel):
    from_variant_id: int
    to_variant_id: int
    relationship_type: str
    metadata: Optional[Dict[str, Any]] = None

class CharacterRelationship(CharacterRelationshipBase):
    relationship_id: int
    created_at: datetime

    class Config:
        from_attributes = True
