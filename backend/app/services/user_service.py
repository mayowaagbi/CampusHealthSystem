# app/services/user_service.py
from typing import List, Optional, Dict
from prisma import Prisma
from prisma.errors import UniqueViolationError, RecordNotFoundError
from passlib.context import CryptContext
from datetime import datetime, timedelta

from app.schemas.user_schema import UserCreate, UserUpdate, UserResponse
from app.services.activity_log_service import ActivityLogService
from app.services.notification_service import NotificationService

# from app.utils.token_generator import generate_verification_token


def generate_verification_token(
    user_id: int, expires_delta: Optional[timedelta] = None
) -> str:
    """
    Generate a verification token for email verification

    Args:
        user_id (int): ID of the user to verify
        expires_delta (Optional[timedelta]): Token expiration time

    Returns:
        str: Encoded verification token
    """
    if not expires_delta:
        expires_delta = timedelta(days=1)  # Default 1 day expiration

    verification_payload = {
        "sub": str(user_id),
        "type": "email_verification",
        "exp": datetime.utcnow() + expires_delta,
    }

    verification_token = jwt.encode(
        verification_payload, SECRET_KEY, algorithm=ALGORITHM
    )

    return verification_token


class UserService:
    # Password hashing context
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    @classmethod
    def hash_password(cls, password: str) -> str:
        """
        Hash a password using bcrypt

        Args:
            password (str): Plain text password

        Returns:
            str: Hashed password
        """
        return cls.pwd_context.hash(password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a password against its hash

        Args:
            plain_password (str): Plain text password
            hashed_password (str): Hashed password

        Returns:
            bool: True if password is correct, False otherwise
        """
        return cls.pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    async def create_user(prisma: Prisma, user_data: UserCreate) -> UserResponse:
        """
        Create a new user

        Args:
            prisma (Prisma): Prisma client
            user_data (User Create): User creation data

        Returns:
            UserResponse: Created user details
        """
        try:
            # Check if user already exists
            existing_user = await prisma.user.find_unique(
                where={"email": user_data.email}
            )
            if existing_user:
                raise ValueError("User  with this email already exists")

            # Hash password
            hashed_password = UserService.hash_password(user_data.password)

            # Generate email verification token
            verification_token = generate_verification_token()

            # Create user
            new_user = await prisma.user.create(
                data={
                    "email": user_data.email,
                    "password": hashed_password,
                    "name": user_data.name,
                    "email_verification_token": verification_token,
                    "email_verified": False,
                }
            )

            # Log user creation activity
            await ActivityLogService.log_activity(
                prisma, user_id=new_user.id, action="USER_CREATED"
            )

            # Send welcome and verification notification
            await NotificationService.create_notification(
                prisma,
                user_id=new_user.id,
                title="Welcome to Campus Health System",
                message="Your account has been successfully created. Please verify your email.",
                type="SYSTEM",
            )

            return UserResponse.from_orm(new_user)

        except UniqueViolationError:
            raise ValueError("User  with this email already exists")
        except Exception as e:
            raise ValueError(f"User  creation failed: {str(e)}")

    @staticmethod
    async def get_user_by_id(prisma: Prisma, user_id: int) -> Optional[UserResponse]:
        """
        Retrieve a user by ID

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user to retrieve

        Returns:
            Optional[User Response]: User details or None
        """
        try:
            user = await prisma.user.find_unique(where={"id": user_id})
            return UserResponse.from_orm(user) if user else None
        except Exception as e:
            raise ValueError(f"Error retrieving user: {str(e)}")

    @staticmethod
    async def get_user_by_email(prisma: Prisma, email: str) -> Optional[UserResponse]:
        """
        Retrieve a user by email

        Args:
            prisma (Prisma): Prisma client
            email (str): Email of the user to retrieve

        Returns:
            Optional[User Response]: User details or None
        """
        try:
            user = await prisma.user.find_unique(where={"email": email})
            return UserResponse.from_orm(user) if user else None
        except Exception as e:
            raise ValueError(f"Error retrieving user: {str(e)}")

    @staticmethod
    async def update_user(
        prisma: Prisma, user_id: int, user_data: UserUpdate
    ) -> UserResponse:
        """
        Update user information

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user to update
            user_data (User Update): Updated user information

        Returns:
            UserResponse: Updated user details
        """
        try:
            # Check if user exists
            existing_user = await prisma.user.find_unique(where={"id": user_id})
            if not existing_user:
                raise ValueError("User  not found")

            # Handle password update if provided
            if user_data.password:
                user_data.password = UserService.hash_password(user_data.password)

            # Update user
            updated_user = await prisma.user.update(
                where={"id": user_id}, data=user_data.dict(exclude_unset=True)
            )

            # Log user update activity
            await ActivityLogService.log_activity(
                prisma, user_id=user_id, action="USER_UPDATED"
            )

            # Send update notification
            await NotificationService.create_notification(
                prisma,
                user_id=user_id,
                title="Profile Updated",
                message="Your profile has been successfully updated.",
                type="SYSTEM",
            )

            return UserResponse.from_orm(updated_user)

        except Exception as e:
            raise ValueError(f"User  update failed: {str(e)}")

    @staticmethod
    async def delete_user(prisma: Prisma, user_id: int) -> Dict[str, str]:
        """
        Delete a user

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user to delete

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            # Check if user exists
            existing_user = await prisma.user.find_unique(where={"id": user_id})
            if not existing_user:
                raise ValueError("User  not found")

            # Delete user
            await prisma.user.delete(where={"id": user_id})

            # Log user deletion activity
            await ActivityLogService.log_activity(
                prisma, user_id=user_id, action="USER_DELETED"
            )

            # Send deletion notification
            await NotificationService.create_notification(
                prisma,
                user_id=user_id,
                title="Account Deleted",
                message="Your account has been deleted as requested.",
                type="SYSTEM",
            )

            return {"message": "User  deleted successfully"}

        except Exception as e:
            raise ValueError(f"User  deletion failed: {str(e)}")
