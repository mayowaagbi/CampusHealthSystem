from typing import Optional
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from enum import Enum


class NotificationType(str, Enum):
    SYSTEM = "SYSTEM"
    USER = "USER"
    ALERT = "ALERT"
    INFO = "INFO"


class NotificationBaseSchema(BaseModel):
    """Base schema for notification data"""

    title: str = Field(..., example="Appointment Reminder")
    message: str = Field(..., example="Your health check is scheduled for tomorrow")
    type: NotificationType = Field(..., example=NotificationType.SYSTEM)
    is_read: Optional[bool] = Field(default=False)


class NotificationCreateSchema(NotificationBaseSchema):
    """Schema for creating a new notification"""

    user_id: int = Field(..., example=1)


class NotificationSchema(NotificationBaseSchema):
    """Complete notification schema with ID and user information"""

    id: int = Field(..., example=1)
    user_id: int = Field(..., example=1)
    created_at: Optional[datetime] = Field(None, example="2023-01-01T00:00:00Z")

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class NotificationUpdateSchema(BaseModel):
    """Schema for updating notification status"""

    is_read: bool = Field(..., example=True)

    model_config = ConfigDict(from_attributes=True)


class NotificationFilterSchema(BaseModel):
    """Schema for filtering notifications"""

    user_id: Optional[int] = None
    type: Optional[NotificationType] = None
    is_read: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)
