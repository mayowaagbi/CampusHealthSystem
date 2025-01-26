import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, UploadFile, File, HTTPException, status, Form, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import aiofiles

# Logging
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create router
router = APIRouter(prefix="/files", tags=["File Upload"])


# Configuration for file uploads
class FileUploadConfig:
    UPLOAD_DIR = "uploads"
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = {
        "pdf",
        "png",
        "jpg",
        "jpeg",
        "doc",
        "docx",
        "txt",
    }


# Ensure upload directory exists
os.makedirs(FileUploadConfig.UPLOAD_DIR, exist_ok=True)


# Response model for file upload
class FileUploadResponse(BaseModel):
    filename: str
    original_name: str
    file_type: str
    file_size: int
    upload_path: str


# Utility functions
def generate_unique_filename(original_filename: str) -> str:
    """
    Generate a unique filename to prevent overwriting
    """
    file_ext = os.path.splitext(original_filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    return unique_filename


def validate_file(file: UploadFile) -> bool:
    """
    Validate uploaded file
    """
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower().lstrip(".")
    if file_ext not in FileUploadConfig.ALLOWED_EXTENSIONS:
        return False

    return True


# File upload routes
@router.post("/upload", response_model=FileUploadResponse)
async def upload_single_file(
    file: UploadFile = File(...), description: Optional[str] = Form(None)
):
    """
    Upload a single file with optional description


    """
    try:
        # Validate file
        if not validate_file(file):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid file type"
            )

        # Generate unique filename
        unique_filename = generate_unique_filename(file.filename)
        file_path = os.path.join(FileUploadConfig.UPLOAD_DIR, unique_filename)

        # Async file writing
        async with aiofiles.open(file_path, "wb") as f:
            content = await file.read()
            await f.write(content)

        # Log upload
        logger.info(f"File uploaded: {unique_filename}")

        return FileUploadResponse(
            filename=unique_filename,
            original_name=file.filename,
            file_type=file.content_type,
            file_size=len(content),
            upload_path=file_path,
        )

    except Exception as e:
        logger.error(f"File upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File upload failed",
        )


@router.post("/upload-multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...), description: Optional[str] = Form(None)
):
    """
    Upload multiple files

    """
    uploaded_files = []

    try:
        for file in files:
            # Validate file
            if not validate_file(file):
                logger.warning(f"Skipping invalid file: {file.filename}")
                continue

            # Generate unique filename
            unique_filename = generate_unique_filename(file.filename)
            file_path = os.path.join(FileUploadConfig.UPLOAD_DIR, unique_filename)

            # Async file writing
            async with aiofiles.open(file_path, "wb") as f:
                content = await file.read()
                await f.write(content)

            # Log upload
            logger.info(f"File uploaded: {unique_filename}")

            uploaded_files.append(
                FileUploadResponse(
                    filename=unique_filename,
                    original_name=file.filename,
                    file_type=file.content_type,
                    file_size=len(content),
                    upload_path=file_path,
                )
            )

        return uploaded_files

    except Exception as e:
        logger.error(f"Multiple file upload error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Multiple file upload failed",
        )


@router.delete("/delete/{filename}")
async def delete_file(filename: str):
    """
    Delete a file from the uploads directory
    """
    try:
        file_path = os.path.join(FileUploadConfig.UPLOAD_DIR, filename)

        if not os.path.exists(file_path):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
            )

        os.remove(file_path)
        logger.info(f"File deleted: {filename}")

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": "File deleted successfully"},
        )

    except Exception as e:
        logger.error(f"File deletion error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File deletion failed",
        )


# Optional: File listing endpoint
@router.get("/list")
async def list_files():
    """
    List all files in the uploads directory

    Returns:
        List[str]: List of filenames
    """
    try:
        files = os.listdir(FileUploadConfig.UPLOAD_DIR)
        return {"files": files}
    except Exception as e:
        logger.error(f"File listing error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File listing failed",
        )
