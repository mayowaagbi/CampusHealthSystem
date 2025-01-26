from fastapi import APIRouter, Depends, HTTPException, status
from prisma import Prisma
from typing import Optional

from app.schemas.user_schema import (
    UserUpdateSchema,
    UserResponseSchema,
    UserProfileSchema,
)
from app.controllers.user_controller import UserController
from app.middleware.auth import get_current_user
from app.dependencies import get_prisma

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileSchema)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
    include_sensitive: Optional[bool] = False,
):
    """
    Retrieve current user's information

    Args:
        current_user: Authenticated user details
        prisma: Prisma database client
        include_sensitive: Flag to include sensitive information

    Returns:
        User profile information
    """
    try:
        user = await UserController.get_user_info(
            user_id=current_user["id"],
            prisma=prisma,
            include_sensitive=include_sensitive,
        )
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred",
        )


@router.put("/me", response_model=UserResponseSchema)
async def update_current_user_info(
    user_data: UserUpdateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Update current user's information

    Args:
        user_data: Updated user information
        current_user: Authenticated user details
        prisma: Prisma database client

    Returns:
        Updated user information
    """
    try:
        updated_user = await UserController.update_user_info(
            user_id=current_user["id"],
            user_data=user_data,
            prisma=prisma,
            current_user=current_user,
        )
        return updated_user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during update",
        )


@router.get("/", response_model=list[UserResponseSchema])
async def list_users(
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
    query: Optional[str] = None,
    role: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
):
    """
    List and search users (admin-only)

    Args:
        current_user: Authenticated user details
        prisma: Prisma database client
        query: Search query string
        role: Filter by user role
        page: Page number for pagination
        page_size: Number of items per page

    Returns:
        List of users
    """
    # Ensure only admins can list users
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to list users"
        )

    try:
        search_results = await UserController.search_users(
            prisma=prisma, query=query, role=role, page=page, page_size=page_size
        )
        return search_results["users"]
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while listing users",
        )


@router.delete("/me")
async def delete_current_user_account(
    current_user: dict = Depends(get_current_user), prisma: Prisma = Depends(get_prisma)
):
    """
    Delete current user's account

    Args:
        current_user: Authenticated user details
        prisma: Prisma database client

    Returns:
        Deletion confirmation message
    """
    try:
        result = await UserController.delete_user(
            user_id=current_user["id"], prisma=prisma, current_user=current_user
        )
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during account deletion",
        )


@router.get("/{user_id}", response_model=UserResponseSchema)
async def get_user_by_id(
    user_id: int,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Retrieve a specific user's information (admin-only)

    Args:
        user_id: ID of the user to retrieve
        current_user: Authenticated user details
        prisma: Prisma database client

    Returns:
        User information
    """
    # Ensure only admins can retrieve other users' details
    if current_user.get("role") != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view user details",
        )

    try:
        user = await UserController.get_user_info(user_id=user_id, prisma=prisma)
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred",
        )
