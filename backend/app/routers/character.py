from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import User
from app.models.world import World
from app.models.character import Character, CharacterVariant
from app.schemas.character import (
    CharacterVariant as CharacterVariantSchema, 
    CharacterVariantCreate, 
    CharacterVariantUpdate,
    CharacterCreate
)
from app.schemas.universe import ChatMessage, ChatRequest
from app.core.auth import get_current_user

router = APIRouter(prefix="/universes/{universe_id}/worlds/{world_id}/characters", tags=["characters"])


def _get_world_or_404(universe_id: int, world_id: int, user_id, db: Session) -> World:
    world = db.query(World).filter(
        World.world_id == world_id,
        World.universe_id == universe_id,
        World.user_id == user_id
    ).first()
    if not world:
        raise HTTPException(status_code=404, detail="World not found")
    return world


@router.post("/", response_model=CharacterVariantSchema, status_code=status.HTTP_201_CREATED)
def create_character_variant(
    universe_id: int,
    world_id: int,
    variant_in: dict, # Support both legacy and new formats
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_world_or_404(universe_id, world_id, current_user.user_id, db)
    
    char_id = variant_in.get("character_id")
    # Handle both new 'variant_name' and legacy 'character_name'
    name = variant_in.get("variant_name") or variant_in.get("character_name")
    
    if not char_id:
        # Create global identity first
        new_char = Character(
            user_id=current_user.user_id,
            universe_id=universe_id,
            character_name=name,
            core_description=variant_in.get("core_description")
        )
        db.add(new_char)
        db.commit()
        db.refresh(new_char)
        char_id = new_char.character_id

    # Create world-specific variant
    new_variant = CharacterVariant(
        character_id=char_id,
        world_id=world_id,
        variant_name=name,
        attributes=variant_in.get("attributes") or variant_in.get("character_attribute") or {},
        status=variant_in.get("status") or "New"
    )
    db.add(new_variant)
    db.commit()
    db.refresh(new_variant)
    
    # Populate legacy fields for response
    new_variant.character_name = name
    new_variant.character_attribute = new_variant.attributes
    
    return new_variant


@router.get("/", response_model=List[CharacterVariantSchema])
def list_character_variants(
    universe_id: int,
    world_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_world_or_404(universe_id, world_id, current_user.user_id, db)
    variants = db.query(CharacterVariant).filter(
        CharacterVariant.world_id == world_id
    ).order_by(CharacterVariant.created_at.asc()).all()
    
    # Populate legacy fields for frontend compatibility
    for v in variants:
        v.character_name = v.variant_name
        v.character_attribute = v.attributes
        
    return variants


@router.delete("/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character_variant(
    universe_id: int,
    world_id: int,
    variant_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    variant = db.query(CharacterVariant).filter(
        CharacterVariant.variant_id == variant_id,
        CharacterVariant.world_id == world_id
    ).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Character variant not found")
    db.delete(variant)
    db.commit()
    return None

@router.put("/{variant_id}", response_model=CharacterVariantSchema)
def update_character_variant(
    universe_id: int,
    world_id: int,
    variant_id: int,
    variant_in: CharacterVariantUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    variant = db.query(CharacterVariant).filter(
        CharacterVariant.variant_id == variant_id,
        CharacterVariant.world_id == world_id
    ).first()
    if not variant:
        raise HTTPException(status_code=404, detail="Character variant not found")
    
    update_data = variant_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(variant, field, value)
        
    db.commit()
    db.refresh(variant)
    return variant


@router.post("/chat", response_model=ChatMessage)
def chat_with_character_weaver(
    universe_id: int,
    world_id: int,
    request: ChatRequest,
    current_user: User = Depends(get_current_user)
):
    user_messages = [m for m in request.messages if m.role == "user"]

    if not user_messages:
        return ChatMessage(role="assistant", content="What soul shall we breathe life into today?")

    latest = user_messages[-1].content.lower()

    if any(w in latest for w in ["name", "call", "title"]):
        response = "A striking name. Tell me more about this character — their traits, their nature, their essence."
    elif any(w in latest for w in ["trait", "attribute", "nature", "personality"]):
        response = "Fascinating qualities. What else defines them? Their strengths, their flaws, their hidden depths?"
    elif any(w in latest for w in ["strength", "flaw", "power", "weakness"]):
        response = "Every soul has layers. Tell me about their history, their origins, or the world that shaped them."
    elif any(w in latest for w in ["history", "origin", "past", "backstory"]):
        response = "A profound history. This character is ready to step into your world. Shall we forge them?"
    else:
        response = "The Weaver is listening. Tell me about their name, their nature, or the secrets they keep."

    return ChatMessage(role="assistant", content=response)
