# app/routes/file_routes.py
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Query,
    Response,
    Form,
)
from typing import List, Optional

from app.controllers.file_controller import FileController
from app.schemas.file_schemas import FileUploadSchema, FileMetadataSchema, FileType
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/files", tags=["File Management"])


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    file_type: FileType = Form(...),
    description: Optional[str] = Form(None),
    confidentiality_level: str = Form("MEDIUM"),
    current_user=Depends(get_current_user),
):
    """
    Upload a file with metadata

    - Requires user authentication
    - Supports various file types
    - Handles file metadata
    """
    try:
        upload_data = FileUploadSchema(
            file_type=file_type,
            description=description,
            confidentiality_level=confidentiality_level,
        )

        result = await FileController.upload_file(file, current_user.id, upload_data)
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/download/{file_id}")
async def download_file(file_id: int, current_user=Depends(get_current_user)):
    """
    Download a file

    - Requires user authentication
    - Checks user permissions
    """
    try:
        file_info = await FileController.download_file(file_id, current_user.id)

        # Return file as response
        return Response(
            content=open(file_info["file_path"], "rb").read(),
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f"attachment; filename={file_info['original_filename']}"
            },
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{file_id}")
async def delete_file(file_id: int, current_user=Depends(get_current_user)):
    """
    Delete a file

    - Requires user authentication
    - Checks user permissions
    """
    try:
        result = await FileController.delete_file(file_id, current_user.id)
        return result

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user-files", response_model=List[FileMetadataSchema])
async def get_user_files(
    current_user=Depends(get_current_user),
    file_type: Optional[FileType] = Query(None),
    skip: int = Query(0),
    limit: int = Query(10),
):
    """
    Retrieve files uploaded by the current user

    - Requires user authentication
    - Supports pagination and filtering by file type
    """
    try:
        files = await FileController.get_user_files(
            current_user.id, file_type, skip, limit
        )
        return files

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
