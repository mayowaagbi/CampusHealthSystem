# app/schemas/provider_schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum


class AppointmentCreateSchema(BaseModel):
    studentId: int
    date: datetime
    time: datetime
    status: str = "PENDING"
    priority: str = "ROUTINE"


class AppointmentUpdateSchema(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    date: Optional[datetime] = None
    time: Optional[datetime] = None


class HealthRecordCreateSchema(BaseModel):
    studentId: int
    diagnosis: str
    prescription: str
    notes: str
    confidentiality: str = "MEDIUM"
    isVerified: bool = False


class HealthRecordUpdateSchema(BaseModel):
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    notes: Optional[str] = None
    confidentiality: Optional[str] = None
    isVerified: Optional[bool] = None


class PrescriptionCreateSchema(BaseModel):
    healthRecordId: int
    medication: str
    dosage: str
    duration: str
    instructions: str


class HealthAlertCreateSchema(BaseModel):
    title: str
    message: str
    severity: str = "LOW"
