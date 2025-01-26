# app/schemas/auth_schemas.py
from pydantic import BaseModel, EmailStr, Field


class UserRegisterSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str


class TokenRefreshSchema(BaseModel):
    refresh_token: str
