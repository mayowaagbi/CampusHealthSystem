# app/schemas/auth_schemas.py
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegisterSchema(BaseModel):
    """
    Schema for user registration
    """

    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., min_length=8, example="SecurePassword123!")
    name: Optional[str] = Field(None, example="John Doe")
    role: Optional[str] = Field(default="STUDENT", example="STUDENT")


class UserLoginSchema(BaseModel):
    """
    Schema for user login
    """

    email: EmailStr = Field(..., example="user@example.com")
    password: str = Field(..., example="SecurePassword123!")


class TokenSchema(BaseModel):
    """
    Schema for token response
    """

    access_token: str = Field(..., example="jwt_access_token")
    refresh_token: Optional[str] = Field(None, example="jwt_refresh_token")
    token_type: str = Field(default="bearer")
    expires_in: int = Field(default=3600)  # Token expiration in seconds


class TokenRefreshSchema(BaseModel):
    """
    Schema for token refresh request
    """

    refresh_token: str = Field(..., example="your_refresh_token_here")


class PasswordResetRequestSchema(BaseModel):
    """
    Schema for password reset request
    """

    email: EmailStr = Field(..., example="user@example.com")


class PasswordResetConfirmSchema(BaseModel):
    """
    Schema for password reset confirmation
    """

    token: str = Field(..., example="reset_token")
    new_password: str = Field(..., min_length=8, example="NewSecurePassword123!")


class UserProfileSchema(BaseModel):
    """
    Schema for user profile information
    """

    id: int
    email: EmailStr
    name: Optional[str] = None
    role: str
    is_active: bool = True

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class UserUpdateSchema(BaseModel):
    """
    Schema for updating user profile
    """

    name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


# Additional schemas can be added as needed
