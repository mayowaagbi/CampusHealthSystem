# app/schemas/admin_schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserCreateSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: str
    name: Optional[str] = None


class UserUpdateSchema(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[str] = None
    name: Optional[str] = None
