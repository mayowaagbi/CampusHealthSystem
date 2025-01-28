# app/controllers/auth_controller.py
from jose import jwt
from datetime import datetime, timedelta
from app.services.auth_service import AuthService
from typing import Dict
from app.services.user_service import UserService
from app.schemas.auth_schemas import (
    UserRegisterSchema,
    UserLoginSchema,
    TokenSchema,
    TokenRefreshSchema,
)


class AuthController:
    @staticmethod
    async def register_user(user_data: UserRegisterSchema) -> Dict:
        """
        Handle user registration
        """
        try:
            # Validate user data
            if await UserService.check_user_exists(user_data.email):
                raise ValueError("User already exists")

            # Create user
            new_user = await UserService.create_user(user_data.dict())

            # Generate tokens
            tokens = await AuthService.generate_tokens(new_user)

            return {"user": new_user, "tokens": tokens}
        except Exception as e:
            raise ValueError(f"Registration failed: {str(e)}")

    @staticmethod
    async def login_user(login_data: UserLoginSchema) -> TokenSchema:
        """
        Authenticate user and generate tokens
        """
        try:
            # Verify user credentials
            user = await AuthService.authenticate_user(
                login_data.email, login_data.password
            )

            # Generate tokens
            tokens = await AuthService.generate_tokens(user)

            # Log login activity
            await UserService.log_user_activity(user.id, "LOGIN")

            return tokens
        except Exception as e:
            raise ValueError(f"Login failed: {str(e)}")

    @staticmethod
    async def logout_user(user_id: int) -> Dict:
        """
        Logout user by invalidating tokens
        """
        try:
            await AuthService.invalidate_tokens(user_id)
            await UserService.log_user_activity(user_id, "LOGOUT")
            return {"message": "Logged out successfully"}
        except Exception as e:
            raise ValueError(f"Logout failed: {str(e)}")

    @staticmethod
    async def refresh_token(refresh_token: str) -> TokenSchema:
        """
        Refresh access token
        """
        try:
            # Validate and refresh token
            new_tokens = await AuthService.refresh_tokens(refresh_token)
            return new_tokens
        except Exception as e:
            raise ValueError(f"Token refresh failed: {str(e)}")
