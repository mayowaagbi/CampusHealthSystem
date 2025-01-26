# app/models/file.py
from sqlalchemy import Column, Integer, String, DateTime
from database import Base


class FileMetadata(Base):
    __tablename__ = "file_metadata"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    original_filename = Column(String)
    file_type = Column(String)
    user_id = Column(Integer)
    upload_date = Column(DateTime)
    description = Column(String)
    file_path = Column(String)
    confidentiality_level = Column(String)
