# app/schemas/student_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime


class StudentProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    profilePicture: Optional[str] = None


class AppointmentCreateSchema(BaseModel):
    providerId: int
    date: datetime
    time: datetime
    priority: str = "ROUTINE"


class MoodLogSchema(BaseModel):
    mood: str
    notes: Optional[str] = None


class JournalCreateSchema(BaseModel):
    title: str
    content: str


class EmergencyContactCreateSchema(BaseModel):
    name: str
    phone: str
    relationship: str


class EmergencyContactUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    relationship: Optional[str] = None


class HelpRequestSchema(BaseModel):
    description: str
    urgency: str = "MEDIUM"


class FeedbackCreateSchema(BaseModel):
    providerId: int
    rating: int = Field(..., ge=1, le=5)
    comments: str
    type: str = "GENERAL"
