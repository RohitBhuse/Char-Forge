from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Annotated

from app.core.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, Token, UserOnboarding
from app.core.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_email == user.user_email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        user_name=user.user_name,
        user_email=user.user_email,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_email == form_data.username).first() # OAuth2 form uses 'username' for the first field
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.user_email, "user_id": str(user.user_id), "user_name": user.user_name},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/onboarding", response_model=UserResponse)
def save_onboarding(
    onboarding: UserOnboarding,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    current_user.genres = ",".join(onboarding.genres)
    current_user.architectural_style = ",".join(onboarding.architectural_style)
    current_user.onboarding_completed = True
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently deletes the current user's account and all associated data
    (universes, worlds, characters) via cascading deletes.
    """
    db.delete(current_user)
    db.commit()
    return None
