from app.models.user import User
from prisma import Prisma
from app.schemas.auth_schemas import UserRegisterSchema  # Import the UserRegisterSchema


class UserRepository:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def create_user(
        self, user_data: UserRegisterSchema, hashed_password: str
    ) -> User:
        """Logic to create a new user in the database."""
        user = await self.prisma.user.create(
            data={
                "email": user_data.email,
                "hashed_password": hashed_password,
            }
        )
        return user

    async def get_user_by_email(self, email: str) -> User:
        """Logic to retrieve a user by email."""
        return await self.prisma.user.find_unique(where={"email": email})

    async def get_user_by_id(self, user_id: int) -> User:
        """Logic to retrieve a user by ID."""
        return await self.prisma.user.find_unique(where={"id": user_id})
