# app/schemas/provider_schemas.py
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime


class ProviderBaseSchema(BaseModel):
    name: str = Field(..., example="Dr. John Smith")
    email: EmailStr = Field(..., example="john.smith@hospital.com")
    specialty: str = Field(..., example="Psychiatry")
    contact_number: str = Field(..., example="+1234567890")


class ProviderCreateSchema(ProviderBaseSchema):
    password: str = Field(..., example="securepassword123")


class ProviderUpdateSchema(ProviderBaseSchema):
    password: Optional[str] = Field(None, example="newsecurepassword123")


class ProviderSchema(ProviderBaseSchema):
    id: int = Field(..., example=1)
    created_at: datetime = Field(..., example="2023-01-01T00:00:00Z")
    updated_at: datetime = Field(..., example="2023-01-01T00:00:00Z")

    class Config:
        orm_mode = True


class AppointmentCreateSchema(BaseModel):
    student_id: int = Field(..., example=1)
    date: datetime = Field(..., example="2023-01-01T10:00:00Z")
    reason: Optional[str] = Field(None, example="Mental health consultation")
    status: str = Field(default="PENDING", example="PENDING")


class AppointmentUpdateSchema(BaseModel):
    date: Optional[datetime] = Field(None, example="2023-01-02T11:00:00Z")
    reason: Optional[str] = Field(None, example="Updated consultation")
    status: Optional[str] = Field(None, example="CONFIRMED")


class AppointmentSchema(AppointmentCreateSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class HealthRecordCreateSchema(BaseModel):
    student_id: int = Field(..., example=1)
    diagnosis: str = Field(..., example="Anxiety Disorder")
    notes: Optional[str] = Field(None, example="Recommended therapy")
    date: datetime = Field(default_factory=datetime.utcnow)


class HealthRecordUpdateSchema(BaseModel):
    diagnosis: Optional[str] = Field(None, example="Updated Diagnosis")
    notes: Optional[str] = Field(None, example="Updated notes")
    date: Optional[datetime] = Field(None, example="2023-01-02T00:00:00Z")


class HealthRecordSchema(HealthRecordCreateSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class PrescriptionCreateSchema(BaseModel):
    student_id: int = Field(..., example=1)
    medication: str = Field(..., example="Prozac")
    dosage: str = Field(..., example="20mg daily")
    start_date: datetime = Field(default_factory=datetime.utcnow)
    end_date: Optional[datetime] = Field(None, example="2023-06-01T00:00:00Z")
    instructions: Optional[str] = Field(None, example="Take with food")


class PrescriptionSchema(PrescriptionCreateSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class HealthAlertCreateSchema(BaseModel):
    student_id: int = Field(..., example=1)
    description: str = Field(..., example="High-risk patient")
    severity: str = Field(default="MEDIUM", example="HIGH")
    date: datetime = Field(default_factory=datetime.utcnow)


class HealthAlertSchema(HealthAlertCreateSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class FeedbackSchema(BaseModel):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)
    content: str = Field(..., example="Excellent care provided")
    rating: int = Field(..., ge=1, le=5, example=5)
    date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True


class PatientRecordSchema(BaseModel):
    """
    Schema for patient records
    """

    id: Optional[int] = None
    patient_id: int
    provider_id: int
    diagnosis: str = Field(..., min_length=3, max_length=500)
    treatment: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class PatientRecordCreateSchema(BaseModel):
    """
    Schema for creating a new patient record
    """

    patient_id: int
    provider_id: int
    diagnosis: str = Field(..., min_length=3, max_length=500)
    treatment: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)


class UpdatePatientSchema(BaseModel):
    """
    Schema for updating an existing patient record
    """

    diagnosis: Optional[str] = Field(None, min_length=3, max_length=500)
    treatment: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)
