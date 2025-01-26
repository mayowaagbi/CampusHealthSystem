from typing import Optional
from fastapi import HTTPException, status
from prisma import Prisma

from app.services.user_service import UserService
from app.schemas.user_schema import UserUpdateSchema, UserResponseSchema
from app.utils.logging import logger


class UserController:
    @staticmethod
    async def get_user_info(user_id: int, prisma: Prisma) -> UserResponseSchema:
        """
        Retrieve user information by ID

        Args:
            user_id (int): ID of the user to retrieve
            prisma (Prisma): Prisma client instance

        Returns:
            UserResponseSchema: User information

        Raises:
            HTTPException: If user is not found
        """
        try:
            # Log the user info retrieval attempt
            logger.info(f"Attempting to retrieve user info for user ID: {user_id}")

            # Retrieve user
            user = await UserService.get_user_by_id(user_id, prisma)

            if not user:
                logger.warning(f"User not found with ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"User with ID {user_id} not found",
                )

            logger.info(f"Successfully retrieved user info for user ID: {user_id}")
            return user

        except Exception as e:
            logger.error(f"Unexpected error retrieving user: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred",
            )

    @staticmethod
    async def update_user_info(
        user_id: int,
        user_data: UserUpdateSchema,
        prisma: Prisma,
        current_user: Optional[dict] = None,
    ) -> UserResponseSchema:
        """
        Update user information

        Args:
            user_id (int): ID of the user to update
            user_data (UserUpdateSchema): Updated user information
            prisma (Prisma): Prisma client instance
            current_user (dict, optional): Currently authenticated user details

        Returns:
            UserResponseSchema: Updated user information

        Raises:
            HTTPException: If update fails or unauthorized
        """
        try:
            # Log the update attempt
            logger.info(f"Attempting to update user info for user ID: {user_id}")

            # Optional authorization check
            if current_user:
                # Example: Only allow users to update their own profile or admins to update any profile
                if current_user["id"] != user_id and current_user["role"] != "ADMIN":
                    logger.warning(
                        f"Unauthorized update attempt for user ID: {user_id}"
                    )
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Not authorized to update this user's profile",
                    )

            # Perform update
            updated_user = await UserService.update_user(user_id, user_data, prisma)

            if not updated_user:
                logger.warning(f"Failed to update user with ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Update failed for user ID {user_id}",
                )

            logger.info(f"Successfully updated user info for user ID: {user_id}")
            return updated_user

        except HTTPException:
            # Re-raise HTTPException to maintain original status and detail
            raise
        except Exception as e:
            logger.error(f"Unexpected error updating user: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred",
            )

    @staticmethod
    async def delete_user(
        user_id: int, prisma: Prisma, current_user: Optional[dict] = None
    ) -> dict:
        """
        Delete a user account

        Args:
            user_id (int): ID of the user to delete
            prisma (Prisma): Prisma client instance
            current_user (dict, optional): Currently authenticated user details

        Returns:
            dict: Deletion confirmation

        Raises:
            HTTPException: If deletion fails or unauthorized
        """
        try:
            # Log the deletion attempt
            logger.info(f"Attempting to delete user with ID: {user_id}")

            # Optional authorization check
            if current_user:
                # Only allow admins or the user themselves to delete the account
                if current_user["id"] != user_id and current_user["role"] != "ADMIN":
                    logger.warning(
                        f"Unauthorized deletion attempt for user ID: {user_id}"
                    )
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Not authorized to delete this user's account",
                    )

            # Perform deletion
            deleted_user = await prisma.user.delete(where={"id": user_id})

            if not deleted_user:
                logger.warning(f"Failed to delete user with ID: {user_id}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Deletion failed for user ID {user_id}",
                )

            logger.info(f"Successfully deleted user with ID: {user_id}")
            return {"message": "User account deleted successfully"}

        except HTTPException:
            # Re-raise HTTPException to maintain original status and detail
            raise
        except Exception as e:
            logger.error(f"Unexpected error deleting user: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred",
            )

    @staticmethod
    async def search_users(
        prisma: Prisma,
        query: Optional[str] = None,
        role: Optional[str] = None,
        page: int = 1,
        page_size: int = 10,
    ):
        """
        Search and paginate users

        Args:
            prisma (Prisma): Prisma client instance
            query (str, optional): Search query (name, email)
            role (str, optional): Filter by user role
            page (int): Page number for pagination
            page_size (int): Number of items per page

        Returns:
            dict: Paginated user results
        """
        try:
            # Log the search attempt
            logger.info(f"Searching users: query={query}, role={role}, page={page}")

            # Prepare search conditions
            where_conditions = {}
            if query:
                where_conditions.update(
                    {
                        "OR": [
                            {"name": {"contains": query, "mode": "insensitive"}},
                            {"email": {"contains": query, "mode": "insensitive"}},
                        ]
                    }
                )

            if role:
                where_conditions["role"] = role

            # Perform user search
            total_users = await prisma.user.count(where=where_conditions)
            users = await prisma.user.find_many(
                where=where_conditions, skip=(page - 1) * page_size, take=page_size
            )

            logger.info(f"Successfully retrieved user search results")
            return {
                "total": total_users,
                "page": page,
                "page_size": page_size,
                "users": users,
            }

        except Exception as e:
            logger.error(f"Unexpected error searching users: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An unexpected error occurred during user search",
            )
