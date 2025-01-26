from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class StudentBaseSchema(BaseModel):
    name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    date_of_birth: Optional[datetime] = Field(None, example="2000-01-01T00:00:00Z")


class StudentCreateSchema(StudentBaseSchema):
    password: str = Field(..., example="securepassword123")


class StudentUpdateSchema(StudentBaseSchema):
    password: Optional[str] = Field(None, example="newsecurepassword123")


class StudentSchema(StudentBaseSchema):
    id: int = Field(..., example=1)
    created_at: datetime = Field(..., example="2023-01-01T00:00:00Z")
    updated_at: datetime = Field(..., example="2023-01-01T00:00:00Z")

    class Config:
        orm_mode = True


class EmergencyContactCreateSchema(BaseModel):
    name: str = Field(..., example="Jane Doe")
    relationship: str = Field(..., example="Mother")
    phone: str = Field(..., example="+1234567890")


class EmergencyContactUpdateSchema(EmergencyContactCreateSchema):
    pass


class EmergencyContactSchema(EmergencyContactCreateSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class AppointmentCreateSchema(BaseModel):
    provider_id: int = Field(..., example=1)
    date: datetime = Field(..., example="2023-01-01T10:00:00Z")


class AppointmentSchema(AppointmentCreateSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    status: str = Field(..., example="PENDING")

    class Config:
        orm_mode = True


class FeedbackCreateSchema(BaseModel):
    content: str = Field(..., example="This is my feedback.")
    rating: int = Field(..., ge=1, le=5, example=5)


class FeedbackSchema(FeedbackCreateSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class HealthRecordSchema(BaseModel):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)
    diagnosis: str = Field(..., example="Flu")
    prescription: str = Field(..., example="Rest and hydration")
    date: datetime = Field(..., example="2023-01-01T00:00:00Z")

    class Config:
        orm_mode = True


class MoodLogSchema(BaseModel):
    mood: str = Field(..., example="Happy")
    notes: Optional[str] = Field(None, example="Felt great today!")


class MoodLogResponseSchema(MoodLogSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    timestamp: datetime = Field(..., example="2023-01-01T00:00:00Z")

    class Config:
        orm_mode = True
