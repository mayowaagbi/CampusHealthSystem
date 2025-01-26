from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from enum import Enum


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    PROVIDER = "PROVIDER"
    SUPPORT = "SUPPORT"


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    role: UserRole
    name: Optional[str] = None


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefreshSchema(BaseModel):
    refresh_token: str
