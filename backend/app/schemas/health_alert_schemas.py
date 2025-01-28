from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from enum import Enum


class ConfidentialityLevel(str, Enum):
    """
    Enum for confidentiality levels of health records
    """

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CONFIDENTIAL = "CONFIDENTIAL"


class HealthAlertBaseSchema(BaseModel):
    student_id: int = Field(..., example=1)
    description: str = Field(..., example="High-risk patient")
    severity: str = Field(
        ..., example="HIGH"
    )  # Severity levels can be LOW, MEDIUM, HIGH
    date: datetime = Field(
        default_factory=datetime.utcnow, example="2023-01-01T00:00:00Z"
    )


class HealthAlertCreateSchema(HealthAlertBaseSchema):
    pass


class HealthAlertSchema(HealthAlertBaseSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True


class HealthAlertSeverity(str, Enum):
    """
    Enum representing health alert severity levels
    """

    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class HealthAlertCreate(BaseModel):
    """
    Schema for creating a new health alert
    """

    title: str = Field(
        ..., min_length=3, max_length=100, example="Urgent Health Concern"
    )
    message: str = Field(
        ...,
        min_length=10,
        max_length=500,
        example="Detailed description of the health alert",
    )
    severity: HealthAlertSeverity = Field(default=HealthAlertSeverity.LOW)
    created_by_id: int = Field(..., gt=0, example=1)
    created_by_type: Optional[str] = Field(None, example="ADMIN or PROVIDER")


class HealthAlertResponse(BaseModel):
    """
    Schema for returning health alert information
    """

    id: int
    title: str
    message: str
    severity: HealthAlertSeverity
    created_by_id: int
    created_by_type: Optional[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class HealthAlertUpdate(BaseModel):
    """
    Schema for updating a health alert
    """

    title: Optional[str] = Field(None, min_length=3, max_length=100)
    message: Optional[str] = Field(None, min_length=10, max_length=500)
    severity: Optional[HealthAlertSeverity] = None

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class HealthAlertFilter(BaseModel):
    """
    Schema for filtering health alerts
    """

    severity: Optional[HealthAlertSeverity] = None
    created_by_id: Optional[int] = None
    created_by_type: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class HealthRecordSchema(BaseModel):
    """
    Schema for health records
    """

    id: Optional[int] = None
    student_id: int
    provider_id: int
    diagnosis: str = Field(..., min_length=3, max_length=500)
    prescription: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)
    confidentiality: ConfidentialityLevel = Field(default=ConfidentialityLevel.MEDIUM)
    is_verified: bool = Field(default=False)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class HealthRecordCreateSchema(BaseModel):
    """
    Schema for creating a new health record
    """

    student_id: int
    provider_id: int
    diagnosis: str = Field(..., min_length=3, max_length=500)
    prescription: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)
    confidentiality: ConfidentialityLevel = Field(default=ConfidentialityLevel.MEDIUM)


class HealthRecordUpdateSchema(BaseModel):
    """
    Schema for updating an existing health record
    """

    diagnosis: Optional[str] = Field(None, min_length=3, max_length=500)
    prescription: Optional[str] = Field(None, max_length=1000)
    notes: Optional[str] = Field(None, max_length=1000)
    confidentiality: Optional[ConfidentialityLevel] = None
    is_verified: Optional[bool] = None


class HealthRecordFilterSchema(BaseModel):
    """
    Schema for filtering health records
    """

    student_id: Optional[int] = None
    provider_id: Optional[int] = None
    confidentiality: Optional[ConfidentialityLevel] = None
    is_verified: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
