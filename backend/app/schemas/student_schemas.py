from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from enum import Enum


class StudentBaseSchema(BaseModel):
    name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    date_of_birth: Optional[datetime] = Field(None, example="2000-01-01T00:00:00Z")

    # Pydantic V2 configuration
    model_config = ConfigDict(from_attributes=True)


class StudentCreateSchema(StudentBaseSchema):
    password: str = Field(..., example="securepassword123")


class StudentUpdateSchema(StudentBaseSchema):
    password: Optional[str] = Field(None, example="newsecurepassword123")


class StudentSchema(StudentBaseSchema):
    id: int = Field(..., example=1)
    created_at: datetime = Field(..., example="2023-01-01T00:00:00Z")
    updated_at: datetime = Field(..., example="2023-01-01T00:00:00Z")

    # Replace Config with model_config for Pydantic V2
    model_config = ConfigDict(from_attributes=True)


class StudentProfileUpdateSchema(BaseModel):
    # Comprehensive profile update schema
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[datetime] = None

    # Pydantic V2 configuration
    model_config = ConfigDict(from_attributes=True)


# Rest of the schemas remain the same, but update Config to model_config
class EmergencyContactCreateSchema(BaseModel):
    name: str = Field(..., example="Jane Doe")
    relationship: str = Field(..., example="Mother")
    phone: str = Field(..., example="+1234567890")

    model_config = ConfigDict(from_attributes=True)


class EmergencyContactUpdateSchema(EmergencyContactCreateSchema):
    pass


class EmergencyContactSchema(EmergencyContactCreateSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)

    model_config = ConfigDict(from_attributes=True)


# Update other schemas similarly
class AppointmentCreateSchema(BaseModel):
    provider_id: int = Field(..., example=1)
    date: datetime = Field(..., example="2023-01-01T10:00:00Z")

    model_config = ConfigDict(from_attributes=True)


class AppointmentSchema(AppointmentCreateSchema):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    status: str = Field(..., example="PENDING")

    model_config = ConfigDict(from_attributes=True)


class StudentHealthInfoSchema(BaseModel):
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class StudentProfileSchema(BaseModel):
    id: int = Field(..., example=1)
    name: str = Field(..., example="John Doe")
    email: EmailStr = Field(..., example="john.doe@example.com")
    department: Optional[str] = Field(None, example="Computer Science")
    year_of_study: Optional[int] = Field(None, example=2)
    health_info: Optional[StudentHealthInfoSchema] = None
    emergency_contacts: Optional[List["EmergencyContactSchema"]] = None

    model_config = ConfigDict(from_attributes=True)


class StudentProfileUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    year_of_study: Optional[int] = None
    medical_history: Optional[str] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class EmergencyContactSchema(BaseModel):
    id: Optional[int] = Field(None, example=1)
    student_id: int = Field(..., example=1)
    name: str = Field(..., example="Jane Doe")
    relationship: str = Field(..., example="Mother")
    phone: str = Field(..., example="+1234567890")

    model_config = ConfigDict(from_attributes=True)


# Forward reference for emergency contacts
StudentProfileSchema.model_rebuild()

from pydantic import BaseModel, Field
from typing import Optional


class MoodLogSchema(BaseModel):
    id: Optional[int] = Field(None, example=1)
    student_id: int = Field(..., example=1)
    mood: str = Field(..., example="Happy")
    timestamp: str = Field(..., example="2023-01-01T00:00:00Z")


class JournalCreateSchema(BaseModel):
    title: str = Field(..., example="My Journal Entry")
    content: str = Field(..., example="Today I learned about...")
    student_id: int = Field(..., example=1)


class HelpRequestStatus(str, Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class HelpRequestType(str, Enum):
    ACADEMIC = "ACADEMIC"
    MENTAL_HEALTH = "MENTAL_HEALTH"
    PERSONAL = "PERSONAL"
    FINANCIAL = "FINANCIAL"
    OTHER = "OTHER"


class HelpRequestBaseSchema(BaseModel):
    """Base schema for help request data"""

    title: str = Field(
        ..., min_length=3, max_length=100, example="Need Academic Guidance"
    )
    description: str = Field(
        ...,
        min_length=10,
        max_length=500,
        example="I'm struggling with my coursework...",
    )
    help_request_type: HelpRequestType = Field(..., example=HelpRequestType.ACADEMIC)


class HelpRequestCreateSchema(HelpRequestBaseSchema):
    """Schema for creating a new help request"""

    student_id: int = Field(..., gt=0, example=1)


class HelpRequestSchema(HelpRequestBaseSchema):
    """Complete help request schema with additional details"""

    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    status: HelpRequestStatus = Field(default=HelpRequestStatus.PENDING)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class HelpRequestUpdateSchema(BaseModel):
    """Schema for updating a help request"""

    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=500)
    status: Optional[HelpRequestStatus] = None
    help_request_type: Optional[HelpRequestType] = None

    model_config = ConfigDict(from_attributes=True)


class HelpRequestFilterSchema(BaseModel):
    """Schema for filtering help requests"""

    student_id: Optional[int] = None
    status: Optional[HelpRequestStatus] = None
    help_request_type: Optional[HelpRequestType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class FeedbackCreateSchema(BaseModel):
    student_id: int = Field(..., example=1)
    feedback: str = Field(..., min_length=10, example="This is my feedback.")
    rating: Optional[int] = Field(None, ge=1, le=5, example=4)  # Rating between 1 and 5


class MoodLogResponseSchema(BaseModel):
    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    mood: str = Field(..., example="Happy")
    notes: Optional[str] = Field(None, example="Feeling great today!")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        orm_mode = True


class JournalBaseSchema(BaseModel):
    """Base schema for journal entry data"""

    title: str = Field(..., min_length=3, max_length=100, example="My Reflections")
    content: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        example="Today, I learned something important...",
    )


class JournalCreateSchema(JournalBaseSchema):
    """Schema for creating a new journal entry"""

    student_id: int = Field(..., gt=0, example=1)


class JournalSchema(JournalBaseSchema):
    """Complete journal entry schema with additional details"""

    id: int = Field(..., example=1)
    student_id: int = Field(..., example=1)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class JournalUpdateSchema(BaseModel):
    """Schema for updating a journal entry"""

    title: Optional[str] = Field(None, min_length=3, max_length=100)
    content: Optional[str] = Field(None, min_length=10, max_length=1000)

    model_config = ConfigDict(from_attributes=True)


class JournalFilterSchema(BaseModel):
    """Schema for filtering journal entries"""

    student_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    keyword: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class FeedbackType(str, Enum):
    """
    Enum for different types of feedback
    """

    GENERAL = "GENERAL"
    HEALTH_SERVICE = "HEALTH_SERVICE"
    COUNSELING = "COUNSELING"
    FACILITY = "FACILITY"
    ACADEMIC = "ACADEMIC"


class FeedbackSchema(BaseModel):
    """
    Schema for student feedback
    """

    id: Optional[int] = None
    student_id: int
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    feedback_type: FeedbackType = Field(default=FeedbackType.GENERAL)
    is_anonymous: bool = Field(default=False)
    status: str = Field(default="PENDING")  # e.g., PENDING, IN_PROGRESS, RESOLVED
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class FeedbackCreateSchema(BaseModel):
    """
    Schema for creating a new feedback
    """

    student_id: int
    title: str = Field(..., min_length=3, max_length=100)
    description: str = Field(..., min_length=10, max_length=1000)
    feedback_type: FeedbackType = Field(default=FeedbackType.GENERAL)
    is_anonymous: bool = Field(default=False)


class FeedbackUpdateSchema(BaseModel):
    """
    Schema for updating an existing feedback
    """

    title: Optional[str] = Field(None, min_length=3, max_length=100)
    description: Optional[str] = Field(None, min_length=10, max_length=1000)
    feedback_type: Optional[FeedbackType] = None
    status: Optional[str] = None


class FeedbackFilterSchema(BaseModel):
    """
    Schema for filtering feedbacks
    """

    student_id: Optional[int] = None
    feedback_type: Optional[FeedbackType] = None
    status: Optional[str] = None
    is_anonymous: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    keyword: Optional[str] = None
