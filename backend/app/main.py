from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, universe, world, character
import app.models

import time
from sqlalchemy.exc import OperationalError

# Create tables with retry logic
MAX_RETRIES = 5
RETRY_DELAY = 5

for attempt in range(MAX_RETRIES):
    try:
        Base.metadata.create_all(bind=engine)
        print("Successfully connected to the database and created tables.")
        break
    except OperationalError as e:
        if attempt < MAX_RETRIES - 1:
            print(f"Database connection failed. Retrying in {RETRY_DELAY} seconds... (Attempt {attempt + 1}/{MAX_RETRIES})")
            time.sleep(RETRY_DELAY)
        else:
            print("Could not connect to the database after multiple attempts.")
            raise e

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
