# app/utils/token_generator.py
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from jose import jwt
from jose.exceptions import JWTError

from app.models.user import User, UserTokenResponse


class TokenService:
    """
    Service for generating and verifying JWT tokens
    """

    # Configuration constants
    SECRET_KEY = "7a859f9a543ff252aff61ebdac20247f3da2c5cee7100172a3b8e20b4485d789"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30

    @staticmethod
    def create_access_token(
        data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a new access token

        Args:
            data (Dict[str, Any]): Payload data for the token
            expires_delta (Optional[timedelta]): Token expiration time

        Returns:
            str: Encoded JWT token
        """
        to_encode = data.copy()

        # Set expiration time
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            # Default expiration: 15 minutes
            expire = datetime.utcnow() + timedelta(minutes=15)

        to_encode.update({"exp": expire})

        # Encode the token
        encoded_jwt = jwt.encode(
            to_encode, TokenService.SECRET_KEY, algorithm=TokenService.ALGORITHM
        )

        return encoded_jwt

    @staticmethod
    def create_user_token(user: User) -> UserTokenResponse:
        """
        Create a token for a specific user

        Args:
            user (User ): User object to create token for

        Returns:
            UserTokenResponse: Token with user information
        """
        # Token payload
        access_token_payload = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }

        # Create access token with longer expiration
        access_token = TokenService.create_access_token(
            access_token_payload,
            expires_delta=timedelta(minutes=TokenService.ACCESS_TOKEN_EXPIRE_MINUTES),
        )

        return UserTokenResponse(
            access_token=access_token, token_type="bearer", user=user
        )

    @staticmethod
    def verify_token(token: str) -> Dict[str, Any]:
        """
        Verify and decode a JWT token

        Args:
            token (str): JWT token to verify

        Returns:
            Dict[str, Any]: Decoded token payload

        Raises:
            JWTError: If token is invalid or expired
        """
        try:
            # Decode the token
            payload = jwt.decode(
                token, TokenService.SECRET_KEY, algorithms=[TokenService.ALGORITHM]
            )
            return payload
        except JWTError as e:
            # Log the specific JWT error
            raise JWTError(f"Token verification failed: {str(e)}")

    @staticmethod
    def create_password_reset_token(
        user_id: int, expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create a password reset token

        Args:
            user_id (int): ID of the user requesting password reset
            expires_delta (Optional[timedelta]): Token expiration time

        Returns:
            str: Encoded password reset token
        """
        if not expires_delta:
            expires_delta = timedelta(hours=1)  # Default 1 hour expiration

        reset_payload = {
            "sub": str(user_id),
            "type": "password_reset",
            "exp": datetime.utcnow() + expires_delta,
        }

        reset_token = jwt.encode(
            reset_payload, TokenService.SECRET_KEY, algorithm=TokenService.ALGORITHM
        )

        return reset_token

    @staticmethod
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
