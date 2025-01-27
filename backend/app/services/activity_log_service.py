# app/services/activity_log_service.py
from typing import List, Dict, Optional
from prisma import Prisma
from datetime import datetime, timedelta


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
        Create a new activity log entry.

        Args:
            prisma (Prisma): Prisma client.
            user_id (int): ID of the user performing the action.
            action (str): Description of the action.
            ip_address (Optional[str]): IP address of the user.
            user_agent (Optional[str]): User agent string.
        """
        try:
            await prisma.activitylog.create(
                data={
                    "userId": user_id,  # Ensure this matches your Prisma schema
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
    ) -> List[Dict]:
        """
        Retrieve activity logs with optional filtering.

        Args:
            prisma (Prisma): Prisma client.
            skip (int): Number of logs to skip.
            limit (int): Maximum number of logs to return.
            user_id (Optional[int]): Filter by user ID.
            start_date (Optional[datetime]): Start of date range.
            end_date (Optional[datetime]): End of date range.
            action (Optional[str]): Filter by action type.

        Returns:
            List[Dict]: List of activity logs.
        """
        try:
            filters = {}
            if user_id:
                filters["userId"] = user_id  # Ensure this matches your Prisma schema

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
                order={"timestamp": "desc"},  # Order by timestamp descending
            )

            return logs

        except Exception as e:
            raise ValueError(f"Error retrieving activity logs: {str(e)}")

    @staticmethod
    async def get_activity_log_summary(prisma: Prisma, days: int = 7) -> Dict:
        """
        Generate a summary of recent activity logs.

               Args:
                   prisma (Prisma): Prisma client.
                   days (int): Number of days to look back.

               Returns:
                   Dict: Dictionary with activity log summary.
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)

        try:
            logs = await prisma.activitylog.find_many(
                where={"timestamp": {"gte": start_date, "lte": end_date}},
                order={"timestamp": "asc"},  # Order by timestamp ascending
            )

            total_logs = len(logs)
            unique_users = len(set(log.userId for log in logs))

            # Create daily summary
            daily_summary = {}
            for log in logs:
                date = log.timestamp.date()
                if date not in daily_summary:
                    daily_summary[date] = 0
                daily_summary[date] += 1

            return {
                "total_logs": total_logs,
                "unique_users": unique_users,
                "daily_summary": [
                    {"date": date, "count": count}
                    for date, count in daily_summary.items()
                ],
            }

        except Exception as e:
            raise ValueError(f"Error generating activity log summary: {str(e)}")
