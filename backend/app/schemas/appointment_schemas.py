from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class AppointmentSchema(BaseModel):
    id: int
    patient_id: int
    date: datetime
    reason: str
    notes: Optional[str] = None


class UpdateAppointmentSchema(BaseModel):
    date: Optional[datetime] = None
    reason: Optional[str] = None
    notes: Optional[str] = None
