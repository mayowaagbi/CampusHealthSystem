from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional


class StudentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str
    date_of_birth: datetime
    address: str


class StudentResponse(StudentCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
