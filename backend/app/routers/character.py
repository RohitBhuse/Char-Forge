from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models import User
from app.models.world import World
from app.models.character import Character
from app.schemas import Character as CharacterSchema, CharacterCreate
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


@router.post("/", response_model=CharacterSchema, status_code=status.HTTP_201_CREATED)
def create_character(
    universe_id: int,
    world_id: int,
    character: CharacterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_world_or_404(universe_id, world_id, current_user.user_id, db)
    new_character = Character(
        character_name=character.character_name,
        character_attribute=character.character_attribute,
        status=character.status,
        universe_id=universe_id,
        world_id=world_id,
        user_id=current_user.user_id,
    )
    db.add(new_character)
    db.commit()
    db.refresh(new_character)
    return new_character


@router.get("/", response_model=List[CharacterSchema])
def list_characters(
    universe_id: int,
    world_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    _get_world_or_404(universe_id, world_id, current_user.user_id, db)
    return db.query(Character).filter(
        Character.world_id == world_id,
        Character.user_id == current_user.user_id
    ).order_by(Character.created_at.asc()).all()


@router.delete("/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(
    universe_id: int,
    world_id: int,
    character_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    character = db.query(Character).filter(
        Character.character_id == character_id,
        Character.world_id == world_id,
        Character.user_id == current_user.user_id
    ).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    db.delete(character)
    db.commit()
    return None

from app.schemas.character import CharacterUpdate

@router.put("/{character_id}", response_model=CharacterSchema)
def update_character(
    universe_id: int,
    world_id: int,
    character_id: int,
    character_in: CharacterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    character = db.query(Character).filter(
        Character.character_id == character_id,
        Character.world_id == world_id,
        Character.user_id == current_user.user_id
    ).first()
    if not character:
        raise HTTPException(status_code=404, detail="Character not found")
    
    update_data = character_in.dict(exclude_unset=True)
    if "tags" in update_data:
        character.tags = update_data["tags"]
    if "character_attribute" in update_data:
        character.character_attribute = update_data["character_attribute"]
        
    db.commit()
    db.refresh(character)
    return character


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
