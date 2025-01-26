# app/middleware/auth.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.models import User
from app.repositories.user_repository import (
    UserRepository,
)  # Ensure you have this import
from app.utils.token_generator import TokenService  # Ensure you have this import
from app.dependencies import get_prisma  # Ensure you have this import
from app.utils.logging import logger  # Ensure you have this import

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


async def get_current_user(
    token: str = Depends(oauth2_scheme), prisma=Depends(get_prisma)
) -> User:
    """
    Dependency to get the current authenticated user from the token.

    Args:
        token (str): JWT token from Authorization header.

    Returns:
        User: The current user object.

    Raises:
        HTTPException: If the token is invalid or user not found.
    """
    try:
        payload = TokenService.verify_token(token)
        user_id = payload.get("sub")  # Adjust based on your token structure

        user_repo = UserRepository(prisma)
        user = await user_repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User  not found")

        return user
    except JWTError:
        logger.warning("Invalid token")
        raise HTTPException(status_code=401, detail="Could not validate credentials")


def admin_required(current_user: User = Depends(get_current_user)):
    """
    Dependency to ensure the current user has admin privileges.

    Args:
        current_user (User ): The current user object.

    Raises:
        HTTPException: If the user is not an admin.
    """
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized as admin")
    return current_user


def provider_required(current_user: User = Depends(get_current_user)):
    """
    Dependency to ensure the current user has provider privileges.

    Args:
        current_user (User ): The current user object.

    Raises:
        HTTPException: If the user is not a provider.
    """
    if current_user.role != "PROVIDER":
        raise HTTPException(status_code=403, detail="Not authorized as provider")
    return current_user
