from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import os
import uuid

# Import routes
from app.routes import (
    student_routes,
    appointment_routes,
    auth_routes,
    user_routes,
    healthcare_provider_routes,
    admin_routes,
)

# Basic logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Lifespan context manager for database connection
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # Here you can add database connection setup if needed
        logger.info("Application startup complete")
        yield
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise
    finally:
        # Here you can add database disconnection logic if needed
        logger.info("Application shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Campus Health System",
    description="Health management platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router inclusion
app.include_router(student_routes.router, prefix="/students", tags=["Students"])
app.include_router(
    appointment_routes.router, prefix="/appointments", tags=["Appointments"]
)
app.include_router(auth_routes.router, prefix="/auth", tags=["Authentication"])
app.include_router(user_routes.router, prefix="/users", tags=["Users"])
app.include_router(
    healthcare_provider_routes.router, prefix="/healthcare", tags=["Healthcare"]
)
app.include_router(admin_routes.router, prefix="/admin", tags=["Admin"])


# File upload endpoint
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Basic file validation and saving
        os.makedirs("uploads", exist_ok=True)
        unique_filename = f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}"
        file_path = os.path.join("uploads", unique_filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        logger.info(f"File uploaded successfully: {unique_filename}")
        return {"filename": unique_filename, "message": "Upload successful"}

    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail="Upload failed")


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Campus Health Management System",
        "status": "healthy",
        "version": "1.0.0",
    }


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Entry point for running the application
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
