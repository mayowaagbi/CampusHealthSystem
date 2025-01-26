from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


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
