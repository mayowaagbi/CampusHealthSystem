# app/services/system_setting_service.py
from typing import Dict, Any, Optional
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas import SystemSettingUpdate


class SystemSettingService:
    @staticmethod
    async def get_system_settings(prisma: Prisma) -> Dict[str, Any]:
        """
        Retrieve all system settings

        Args:
            prisma (Prisma): Prisma client

        Returns:
            Dict of system settings
        """
        try:
            # Retrieve all system settings
            settings = await prisma.systemsetting.find_many()

            return {setting.key: setting.value for setting in settings}
        except Exception as e:
            raise ValueError(f"Error retrieving system settings: {str(e)}")

    @staticmethod
    async def get_system_setting(prisma: Prisma, key: str) -> Optional[Any]:
        """
        Retrieve a specific system setting by its key

        Args:
            prisma (Prisma): Prisma client
            key (str): The key of the setting to retrieve

        Returns:
            The value of the specified system setting
        """
        try:
            # Find the specific setting by key
            setting = await prisma.systemsetting.find_unique(where={"key": key})

            if setting:
                return setting.value
            else:
                return None
        except Exception as e:
            raise ValueError(f"Error retrieving system setting: {str(e)}")

    @staticmethod
    async def update_system_setting(
        prisma: Prisma, setting_update: SystemSettingUpdate
    ) -> Dict[str, Any]:
        """
        Update a specific system setting

        Args:
            prisma (Prisma): Prisma client
            setting_update (SystemSettingUpdate): The updated setting data

        Returns:
            Updated system setting
        """
        try:
            # Check if setting exists
            existing_setting = await prisma.systemsetting.find_unique(
                where={"key": setting_update.key}
            )

            if not existing_setting:
                # Optionally, create the setting if it doesn't exist
                new_setting = await prisma.systemsetting.create(
                    data={"key": setting_update.key, "value": setting_update.value}
                )
                return {
                    "key": new_setting.key,
                    "value": new_setting.value,
                    "message": "New setting created",
                }

            # Update existing setting
            updated_setting = await prisma.systemsetting.update(
                where={"key": setting_update.key}, data={"value": setting_update.value}
            )

            return {
                "key": updated_setting.key,
                "value": updated_setting.value,
                "message": "Setting updated successfully",
            }

        except RecordNotFoundError:
            raise ValueError(f"Setting with key '{setting_update.key}' not found.")
        except Exception as e:
            raise ValueError(f"Error updating system setting: {str(e)}")

    @staticmethod
    async def create_system_setting(
        prisma: Prisma, key: str, value: Any
    ) -> Dict[str, Any]:
        """
        Create a new system setting

        Args:
            prisma (Prisma): Prisma client
            key (str): The key of the new setting
            value (Any): The value of the new setting

        Returns:
            Created system setting
        """
        try:
            # Check if setting already exists
            existing_setting = await prisma.systemsetting.find_unique(
                where={"key": key}
            )

            if existing_setting:
                raise ValueError(f"Setting with key '{key}' already exists")

            # Create new setting
            new_setting = await prisma.systemsetting.create(
                data={"key": key, "value": str(value)}  # Convert to string for storage
            )

            return {
                "key": new_setting.key,
                "value": new_setting.value,
                "message": "Setting created successfully",
            }
        except Exception as e:
            raise ValueError(f"Error creating system setting: {str(e)}")

    @staticmethod
    async def delete_system_setting(prisma: Prisma, key: str) -> Dict[str, str]:
        """
        Delete a system setting

        Args:
            prisma (Prisma): Prisma client
            key (str): The key of the setting to delete

        Returns:
            Deletion confirmation message
        """
        try:
            # Check if setting exists
            existing_setting = await prisma.systemsetting.find_unique(
                where={"key": key}
            )

            if not existing_setting:
                raise ValueError(f"Setting with key '{key}' not found")

            # Delete the setting
            await prisma.systemsetting.delete(where={"key": key})

            return {"message": f"Setting with key '{key}' deleted successfully"}
        except Exception as e:
            raise ValueError(f"Error deleting system setting: {str(e)}")
