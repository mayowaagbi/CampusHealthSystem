# app/controllers/file_controller.py
import os
import uuid
from typing import Dict, List
from fastapi import UploadFile, File

from app.services.file_service import FileService
from app.schemas.file_schemas import FileUploadSchema, FileMetadataSchema


class FileController:
    @staticmethod
    async def upload_file(
        file: UploadFile, current_user_id: int, upload_data: FileUploadSchema
    ) -> Dict:
        """
        Upload a file with metadata

        Args:
            file (UploadFile): File to be uploaded
            current_user_id (int): ID of the user uploading the file
            upload_data (FileUploadSchema): Additional file metadata

        Returns:
            Dict with file upload details
        """
        try:
            # Validate file
            if not file.filename:
                raise ValueError("No file uploaded")

            # Generate unique filename
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"

            # Create uploads directory if not exists
            upload_dir = "uploads"
            os.makedirs(upload_dir, exist_ok=True)

            # Full file path
            file_path = os.path.join(upload_dir, unique_filename)

            # Save file
            with open(file_path, "wb") as buffer:
                contents = await file.read()
                buffer.write(contents)

            # Create file metadata
            file_metadata = {
                "filename": unique_filename,
                "original_filename": file.filename,
                "file_type": upload_data.file_type,
                "user_id": current_user_id,
                "file_path": file_path,
                "description": upload_data.description,
                "confidentiality_level": upload_data.confidentiality_level,
                "file_size": len(contents),
            }

            # Save file metadata to database
            uploaded_file = await FileService.create_file_metadata(file_metadata)

            return {
                "message": "File uploaded successfully",
                "file_id": uploaded_file.id,
                "filename": unique_filename,
            }

        except Exception as e:
            # Clean up file if upload fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise ValueError(f"File upload failed: {str(e)}")

    @staticmethod
    async def download_file(file_id: int, current_user_id: int) -> Dict:
        """
        Download a file

        Args:
            file_id (int): ID of the file to download
            current_user_id (int): ID of the current user

        Returns:
            Dict with file download details
        """
        try:
            # Retrieve file metadata
            file_metadata = await FileService.get_file_metadata(
                file_id, current_user_id
            )

            # Check file existence
            if not os.path.exists(file_metadata.file_path):
                raise ValueError("File not found")

            return {
                "file_path": file_metadata.file_path,
                "filename": file_metadata.filename,
                "original_filename": file_metadata.original_filename,
            }

        except Exception as e:
            raise ValueError(f"File download failed: {str(e)}")

    @staticmethod
    async def delete_file(file_id: int, current_user_id: int) -> Dict:
        """
        Delete a file

        Args:
            file_id (int): ID of the file to delete
            current_user_id (int): ID of the current user

        Returns:
            Dict with deletion confirmation
        """
        try:
            # Retrieve and delete file metadata
            file_metadata = await FileService.delete_file(file_id, current_user_id)

            # Remove physical file
            if os.path.exists(file_metadata.file_path):
                os.remove(file_metadata.file_path)

            return {"message": "File deleted successfully", "file_id": file_id}

        except Exception as e:
            raise ValueError(f"File deletion failed: {str(e)}")

    @staticmethod
    async def get_user_files(
        current_user_id: int,
        file_type: Optional[FileType] = None,
        skip: int = 0,
        limit: int = 10,
    ) -> List[FileMetadataSchema]:
        """
        Retrieve files for a user

        Args:
            current_user_id (int): ID of the current user
            file_type (Optional[FileType]): Optional filter by file type
            skip (int): Pagination offset
            limit (int): Maximum number of files to return

        Returns:
            List of file metadata
        """
        try:
            files = await FileService.get_user_files(
                current_user_id, file_type, skip, limit
            )
            return files

        except Exception as e:
            raise ValueError(f"Error retrieving files: {str(e)}")
