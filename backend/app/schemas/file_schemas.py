# app/schemas/file_schemas.py
from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum
from datetime import datetime


class FileType(str, Enum):
    MEDICAL_RECORD = "MEDICAL_RECORD"
    PRESCRIPTION = "PRESCRIPTION"
    REPORT = "REPORT"
    OTHER = "OTHER"


class FileUploadSchema(BaseModel):
    file_type: FileType
    description: Optional[str] = None
    confidentiality_level: str = "MEDIUM"


class FileMetadataSchema(BaseModel):
    id: int
    filename: str
    file_type: FileType
    user_id: int
    upload_date: datetime
    description: Optional[str]
    file_path: str
    confidentiality_level: str

    class Config:
        orm_mode = True
