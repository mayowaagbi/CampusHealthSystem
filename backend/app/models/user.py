# app/models/user.py
from typing import Optional, List
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    """
    Enum representing user roles in the system
    """

    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    PROVIDER = "PROVIDER"


class User(BaseModel):
    """
    User model representing the core user information
    """

    id: int
    email: str
    role: UserRole
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    # Optional relations
    student: Optional[dict] = None
    admin: Optional[dict] = None
    healthcare_provider: Optional[dict] = None

    class Config:
        """
        Pydantic configuration for ORM mode
        """

        orm_mode = True
        from_attributes = True


class UserProfile(BaseModel):
    """
    Detailed user profile information
    """

    id: int
    email: str
    role: UserRole
    is_active: bool = True
    created_at: datetime
    updated_at: datetime

    # Profile-specific details based on role
    name: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        orm_mode = True
        from_attributes = True


class UserCreateRequest(BaseModel):
    """
    Schema for creating a new user
    """

    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=8, example="SecurePassword123!")
    role: UserRole = Field(default=UserRole.STUDENT)
    is_active: bool = Field(default=True)

    # Optional additional fields
    name: Optional[str] = Field(None, example="John Doe")
    phone: Optional[str] = Field(None, example="+1234567890")


class UserUpdateRequest(BaseModel):
    """
    Schema for updating user information
    """

    email: Optional[EmailStr] = Field(None, example="newemail@example.com")
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    name: Optional[str] = None
    phone: Optional[str] = None


class UserLoginRequest(BaseModel):
    """
    Schema for user login
    """

    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., example="SecurePassword123!")


class UserTokenResponse(BaseModel):
    """
    Schema for token response after authentication
    """

    access_token: str
    token_type: str = "bearer"
    user: UserProfile


class UserPasswordResetRequest(BaseModel):
    """
    Schema for password reset request
    """

    email: EmailStr = Field(..., example="user@example.com")


class UserPasswordResetConfirmRequest(BaseModel):
    """
    Schema for password reset confirmation
    """

    token: str
    new_password: str = Field(..., min_length=8)


class UserActivityLog(BaseModel):
    """
    Schema for user activity logging
    """

    id: int
    user_id: int
    action: str
    timestamp: datetime

    class Config:
        orm_mode = True
        from_attributes = True


class UserStatistics(BaseModel):
    """
    Schema for user-related statistics
    """

    total_users: int
    active_users: int
    users_by_role: dict[UserRole, int]


# Additional helper functions or methods can be added here if needed
