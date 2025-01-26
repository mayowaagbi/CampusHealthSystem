from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
from prisma import Prisma
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()


class DatabaseManager:
    _instance = None

    @classmethod
    async def get_db(cls):
        if cls._instance is None:
            cls._instance = Prisma()
            await cls._instance.connect()
        return cls._instance

    @classmethod
    async def close_db(cls):
        if cls._instance:
            await cls._instance.disconnect()
            cls._instance = None


# Dependency for database connection
async def get_prisma():
    try:
        db = await DatabaseManager.get_db()
        yield db
    finally:
        await DatabaseManager.close_db()


# Lifespan manager for FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    prisma = Prisma()
    await prisma.connect()
    app.state.db = prisma
    yield
    # Shutdown logic
    await prisma.disconnect()


# Create FastAPI app with lifespan
app = FastAPI(lifespan=lifespan)
