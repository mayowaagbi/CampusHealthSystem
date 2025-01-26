# app/services/file_service.py
from typing import Dict, List, Optional
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.file_schemas import FileMetadataSchema, FileCreateSchema


class FileService:
    @staticmethod
    async def create_file_metadata(
        prisma: Prisma, file_metadata: FileCreateSchema
    ) -> FileMetadataSchema:
        """
        Create a new file metadata entry

        Args:
            prisma (Prisma): Prisma client
            file_metadata (FileCreateSchema): Metadata for the file

        Returns:
            FileMetadataSchema: Created file metadata
        """
        try:
            new_file_metadata = await prisma.filemetadata.create(
                data={
                    "user_id": file_metadata.user_id,
                    "file_name": file_metadata.file_name,
                    "file_type": file_metadata.file_type,
                    "file_size": file_metadata.file_size,
                    "upload_date": file_metadata.upload_date,
                    "description": file_metadata.description,
                }
            )
            return FileMetadataSchema.from_orm(new_file_metadata)

        except Exception as e:
            raise ValueError(f"Error creating file metadata: {str(e)}")

    @staticmethod
    async def get_file_metadata(
        prisma: Prisma, file_id: int, user_id: int
    ) -> FileMetadataSchema:
        """
        Retrieve file metadata by file ID and user ID

        Args:
            prisma (Prisma): Prisma client
            file_id (int): ID of the file
            user_id (int): ID of the user

        Returns:
            FileMetadataSchema: File metadata details
        """
        try:
            file_metadata = await prisma.filemetadata.find_unique(
                where={"id": file_id, "user_id": user_id}
            )
            if not file_metadata:
                raise ValueError("File metadata not found")

            return FileMetadataSchema.from_orm(file_metadata)

        except Exception as e:
            raise ValueError(f"Error retrieving file metadata: {str(e)}")

    @staticmethod
    async def delete_file(prisma: Prisma, file_id: int, user_id: int) -> Dict[str, str]:
        """
        Delete file metadata

        Args:
            prisma (Prisma): Prisma client
            file_id (int): ID of the file
            user_id (int): ID of the user

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            file_metadata = await prisma.filemetadata.find_unique(
                where={"id": file_id, "user_id": user_id}
            )
            if not file_metadata:
                raise ValueError("File metadata not found")

            await prisma.filemetadata.delete(where={"id": file_id})

            return {"message": "File metadata deleted successfully"}

        except RecordNotFoundError:
            raise ValueError("File metadata not found")
        except Exception as e:
            raise ValueError(f"Error deleting file metadata: {str(e)}")

    @staticmethod
    async def get_user_files(
        prisma: Prisma,
        user_id: int,
        file_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[FileMetadataSchema]:
        """
        Retrieve files for a user

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user
            file_type (Optional[str]): Optional filter for file type
            skip (int): Number of records to skip
            limit (int): Maximum number of records to return

        Returns:
            List[FileMetadataSchema]: List of file metadata for the user
        """
        try:
            filters = {"user_id": user_id}
            if file_type:
                filters["file_type"] = file_type

            files = await prisma.filemetadata.find_many(
                where=filters,
                skip=skip,
                take=limit,
                order_by={"upload_date": "desc"},  # Order by upload date
            )

            return [FileMetadataSchema.from_orm(file) for file in files]

        except Exception as e:
            raise ValueError(f"Error retrieving user files: {str(e)}")
