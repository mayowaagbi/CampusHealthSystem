from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
from typing import Optional
from enum import Enum
from datetime import datetime


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    STUDENT = "STUDENT"
    PROVIDER = "PROVIDER"
    STAFF = "STAFF"


class UserGender(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"
    PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY"


class BaseUserSchema(BaseModel):
    """
    Base user schema with common fields
    """

    email: EmailStr
    name: str = Field(
        ..., min_length=2, max_length=100, description="Full name of the user"
    )
    role: UserRole
    gender: Optional[UserGender] = None


class UserCreate(BaseModel):
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


class UserCreateSchema(BaseUserSchema):
    """
    Schema for user creation
    """

    password: str = Field(..., min_length=8, max_length=64, description="User password")

    @validator("password")
    def validate_password(cls, password):
        """
        Password validation
        """
        # At least one uppercase, one lowercase, one number
        if not any(char.isupper() for char in password):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(char.islower() for char in password):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char.isdigit() for char in password):
            raise ValueError("Password must contain at least one number")
        return password


class UserUpdateSchema(BaseUserSchema):
    """
    Schema for user update
    """

    email: Optional[EmailStr] = None
    name: Optional[str] = None
    role: Optional[UserRole] = None
    gender: Optional[UserGender] = None


class UserUpdate(BaseModel):
    """
    Schema for updating user information
    """

    email: Optional[EmailStr] = Field(None, example="newemail@example.com")
    password: Optional[str] = Field(None, min_length=8)
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    name: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    """
    Schema for user response (without sensitive information)
    """

    id: int
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    # Pydantic V2 configuration for ORM mode
    model_config = ConfigDict(from_attributes=True)


class UserResponseSchema(BaseUserSchema):
    """
    Schema for user response (what to return to client)
    """

    id: int
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        orm_mode = True


class PasswordResetSchema(BaseModel):
    """
    Schema for password reset
    """

    email: EmailStr
    current_password: str
    new_password: str

    @validator("new_password")
    def validate_new_password(cls, new_password, values):
        """
        Validate that new password is different from current password
        """
        current_password = values.get("current_password")
        if new_password == current_password:
            raise ValueError("New password must be different from current password")

        # Additional password validation
        if len(new_password) < 8:
            raise ValueError("Password must be at least 8 characters long")

        return new_password


class UserProfileSchema(BaseModel):
    """
    Detailed user profile schema
    """

    id: int
    email: EmailStr
    name: str
    role: UserRole
    gender: Optional[UserGender]
    date_of_birth: Optional[datetime]
    phone_number: Optional[str]
    address: Optional[str]
    profile_picture: Optional[str]

    class Config:
        orm_mode = True


class UserCredentialsSchema(BaseModel):
    """
    Schema for user login credentials
    """

    email: EmailStr
    password: str


class UserTokenSchema(BaseModel):
    """
    Schema for token-related operations
    """

    access_token: str
    refresh_token: Optional[str]
    token_type: str = "bearer"
    expires_in: Optional[int]


# Example of additional specialized schemas
class StudentProfileSchema(UserProfileSchema):
    """
    Additional fields specific to student profile
    """

    student_id: Optional[str]
    department: Optional[str]
    year_of_study: Optional[int]


class ProviderProfileSchema(UserProfileSchema):
    """
    Additional fields specific to healthcare provider profile
    """

    specialization: Optional[str]
    medical_license_number: Optional[str]
    qualifications: Optional[list[str]]
