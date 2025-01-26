class NotificationController:
    @staticmethod
    async def get_notifications(
        user_id: int, skip: int = 0, limit: int = 10
    ) -> List[NotificationSchema]:
        """
        Retrieve user notifications
        """
        try:
            notifications = await NotificationService.get_user_notifications(
                user_id, skip, limit
            )
            return notifications
        except Exception as e:
            raise ValueError(f"Error retrieving notifications: {str(e)}")

    @staticmethod
    async def mark_notification_as_read(user_id: int, notification_id: int) -> Dict:
        """
        Mark a specific notification as read
        """
        try:
            result = await NotificationService.mark_notification_read(
                user_id, notification_id
            )
            return result
        except Exception as e:
            raise ValueError(f"Error marking notification: {str(e)}")
