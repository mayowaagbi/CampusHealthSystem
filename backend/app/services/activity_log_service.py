# app/services/activity_log_service.py
from typing import List, Dict, Optional
from prisma import Prisma
from prisma.errors import RecordNotFoundError
from datetime import datetime, timedelta

from app.models import ActivityLog


class ActivityLogService:
    @staticmethod
    async def create_activity_log(
        prisma: Prisma,
        user_id: int,
        action: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> None:
        """
        Create a new activity log entry

        Args:
            prisma (Prisma): Prisma client
            user_id (int): ID of the user performing the action
            action (str): Description of the action
            ip_address (Optional[str]): IP address of the user
            user_agent (Optional[str]): User agent string
        """
        try:
            new_log = await prisma.activitylog.create(
                data={
                    "user_id": user_id,
                    "action": action,
                    "ip_address": ip_address,
                    "user_agent": user_agent,
                }
            )
        except Exception as e:
            raise ValueError(f"Error creating activity log: {str(e)}")

    @staticmethod
    async def get_activity_logs(
        prisma: Prisma,
        skip: int = 0,
        limit: int = 100,
        user_id: Optional[int] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        action: Optional[str] = None,
    ) -> List[ActivityLog]:
        """
        Retrieve activity logs with optional filtering

        Args:
            prisma (Prisma): Prisma client
            skip (int): Number of logs to skip
            limit (int): Maximum number of logs to return
            user_id (Optional[int]): Filter by user ID
            start_date (Optional[datetime]): Start of date range
            end_date (Optional[datetime]): End of date range
            action (Optional[str]): Filter by action type

        Returns:
            List[ActivityLog]: List of activity logs
        """
        try:
            filters = {}
            if user_id:
                filters["user_id"] = user_id

            if start_date:
                filters["timestamp"] = {"gte": start_date}

            if end_date:
                filters["timestamp"] = {"lte": end_date}

            if action:
                filters["action"] = action

            logs = await prisma.activitylog.find_many(
                where=filters,
                skip=skip,
                take=limit,
                order_by={"timestamp": "desc"},  # Order by timestamp descending
            )

            return logs

        except Exception as e:
            raise ValueError(f"Error retrieving activity logs: {str(e)}")

    @staticmethod
    async def get_activity_log_summary(prisma: Prisma, days: int = 7) -> Dict:
        """
        Generate a summary of recent activity logs

        Args:
            prisma (Prisma): Prisma client
            days (int): Number of days to look back

        Returns:
            Dict: Dictionary with activity log summary
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        try:
            summary = await prisma.activitylog.group_by(
                by=["timestamp"],
                where={"timestamp": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
                _distinct={"user_id": True},
            )

            total_logs = sum(log._count.id for log in summary)
            unique_users = len(set(log.user_id for log in summary))

            return {
                "total_logs": total_logs,
                "unique_users": unique_users,
                "daily_summary": [
                    {"date": log.timestamp.date(), "count": log._count.id}
                    for log in summary
                ],
            }

        except Exception as e:
            raise ValueError(f"Error generating activity log summary: {str(e)}")
