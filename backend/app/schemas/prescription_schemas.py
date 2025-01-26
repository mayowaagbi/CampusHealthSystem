from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class PrescriptionBaseSchema(BaseModel):
    student_id: int = Field(..., example=1)
    medication: str = Field(..., example="Prozac")
    dosage: str = Field(..., example="20mg daily")
    start_date: datetime = Field(
        default_factory=datetime.utcnow, example="2023-01-01T00:00:00Z"
    )
    end_date: Optional[datetime] = Field(None, example="2023-06-01T00:00:00Z")
    instructions: Optional[str] = Field(None, example="Take with food")


class PrescriptionCreateSchema(PrescriptionBaseSchema):
    pass


class PrescriptionSchema(PrescriptionBaseSchema):
    id: int = Field(..., example=1)
    provider_id: int = Field(..., example=1)

    class Config:
        orm_mode = True
