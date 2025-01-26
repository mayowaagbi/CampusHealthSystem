# app/services/notification_service.py
from typing import Dict, List, Any
from prisma import Prisma
from prisma.errors import RecordNotFoundError
from app.schemas.notification_schemas import (
    NotificationCreateSchema,
    NotificationSchema,
)


class NotificationService:
    @staticmethod
    async def create_notification(
        prisma: Prisma, user_id: int, title: str, message: str, notification_type: str
    ) -> NotificationSchema:
        """
        Create a new notification

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user to notify
            title (str): Title of the notification
            message (str): Message content of the notification
            notification_type (str): Type of notification (e.g., SYSTEM, ALERT)

        Returns:
            NotificationSchema: Created notification object
        """
        try:
            notification = await prisma.notification.create(
                data={
                    "user_id": user_id,
                    "title": title,
                    "message": message,
                    "type": notification_type,
                    "is_read": False,  # Default to unread
                }
            )
            return NotificationSchema.from_orm(notification)
        except Exception as e:
            raise ValueError(f"Error creating notification: {str(e)}")

    @staticmethod
    async def get_user_notifications(
        prisma: Prisma, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[NotificationSchema]:
        """
        Retrieve notifications for a specific user

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user
            skip (int): Number of notifications to skip for pagination
            limit (int): Maximum number of notifications to return

        Returns:
            List[NotificationSchema]: List of notifications for the user
        """
        try:
            notifications = await prisma.notification.find_many(
                where={"user_id": user_id},
                skip=skip,
                take=limit,
                order_by={"created_at": "desc"},  # Order by creation date
            )
            return [
                NotificationSchema.from_orm(notification)
                for notification in notifications
            ]
        except Exception as e:
            raise ValueError(f"Error retrieving notifications: {str(e)}")

    @staticmethod
    async def mark_notification_as_read(
        prisma: Prisma, notification_id: int
    ) -> NotificationSchema:
        """
        Mark a notification as read

        Args:
            prisma (Prisma): Prisma client
            notification_id (int): ID of the notification to mark as read

        Returns:
            NotificationSchema: Updated notification object
        """
        try:
            notification = await prisma.notification.update(
                where={"id": notification_id}, data={"is_read": True}
            )
            return NotificationSchema.from_orm(notification)
        except RecordNotFoundError:
            raise ValueError("Notification not found")
        except Exception as e:
            raise ValueError(f"Error marking notification as read: {str(e)}")

    @staticmethod
    async def delete_notification(
        prisma: Prisma, notification_id: int
    ) -> Dict[str, str]:
        """
        Delete a notification

        Args:
            prisma (Prisma): Prisma client
            notification_id (int): ID of the notification to delete

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            await prisma.notification.delete(where={"id": notification_id})
            return {"message": "Notification deleted successfully"}
        except RecordNotFoundError:
            raise ValueError("Notification not found")
        except Exception as e:
            raise ValueError(f"Error deleting notification: {str(e)}")
