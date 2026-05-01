from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, universe, world, character
import app.models

# Create tables
Base.metadata.create_all(bind=engine)

# ── FastAPI app ──────────────────────────────────────────────────
app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(universe.router)
app.include_router(world.router)
app.include_router(character.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Character Forge API"}
