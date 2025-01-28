# app/services/auth_service.py
from jose import jwt
from datetime import datetime, timedelta
from app.services.user_service import UserService
from app.schemas.token_schema import TokenSchema


class AuthService:
    SECRET_KEY = "jHs9z8DLq5rXPN12xVyBQFGmr3oTKUJEX4MAycWafZkw"
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    REFRESH_TOKEN_EXPIRE_DAYS = 7

    @classmethod
    async def generate_tokens(cls, user):
        """Generate access and refresh tokens"""
        access_token_expires = timedelta(minutes=cls.ACCESS_TOKEN_EXPIRE_MINUTES)
        refresh_token_expires = timedelta(days=cls.REFRESH_TOKEN_EXPIRE_DAYS)

        access_token = cls.create_access_token(
            user.id, expires_delta=access_token_expires
        )
        refresh_token = cls.create_refresh_token(
            user.id, expires_delta=refresh_token_expires
        )

        return TokenSchema(access_token=access_token, refresh_token=refresh_token)

    @classmethod
    def create_access_token(cls, user_id: int, expires_delta: timedelta = None):
        to_encode = {"sub": user_id}
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

    @classmethod
    def create_refresh_token(cls, user_id: int, expires_delta: timedelta = None):
        to_encode = {"sub": user_id}
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=7)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, cls.SECRET_KEY, algorithm=cls.ALGORITHM)

    @classmethod
    async def authenticate_user(cls, email: str, password: str):
        user = await UserService.get_user_by_email(email)
        if not user or not UserService.verify_password(password, user.password):
            raise ValueError("Invalid credentials")
        return user

    @classmethod
    async def invalidate_tokens(cls, user_id: int):
        # Logic to invalidate tokens (e.g., store in a blacklist)
        pass

    @classmethod
    async def refresh_tokens(cls, refresh_token: str):
        # Logic to validate and refresh tokens
        pass
