# app/repositories/log_repository.py
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from prisma import Prisma


class LogRepository:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def create_log(
        self,
        user_id: int,
        action: str,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
    ) -> Dict:
        """
        Create a new activity log entry.
        """
        try:
            new_log = await self.prisma.activitylog.create(
                data={
                    "user_id": user_id,
                    "action": action,
                    "ip_address": ip_address,
                    "user_agent": user_agent,
                }
            )
            return new_log
        except Exception as e:
            raise ValueError(f"Error creating activity log: {str(e)}")

    async def get_logs(
        self, skip: int = 0, limit: int = 100, user_id: Optional[int] = None
    ) -> List[Dict]:
        """
        Retrieve activity logs with optional filtering.

        """
        try:
            # Prepare filters
            filters = {}
            if user_id:
                filters["user_id"] = user_id

            # Retrieve logs
            logs = await self.prisma.activitylog.find_many(
                where=filters, skip=skip, take=limit, order_by={"timestamp": "desc"}
            )
            return logs
        except Exception as e:
            raise ValueError(f"Error retrieving activity logs: {str(e)}")

    async def get_log_summary(self, days: int = 7) -> Dict:
        """
        Generate a summary of recent activity logs.
        """
        try:
            # Set date range
            end_date = datetime.now(datetime.timezone.utc)
            start_date = end_date - timedelta(days=days)

            # Group logs by date and calculate summary
            summary = await self.prisma.activitylog.group_by(
                by=["timestamp"],
                where={"timestamp": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
                _distinct={"user_id": True},
            )

            # Process summary data
            daily_summary = []
            total_logs = 0
            unique_users = set()

            for log_group in summary:
                daily_summary.append(
                    {"date": log_group.timestamp.date(), "count": log_group._count.id}
                )
                total_logs += log_group._count.id
                unique_users.add(log_group.user_id)

            return {
                "total_logs": total_logs,
                "unique_users": len(unique_users),
                "daily_summary": daily_summary,
            }
        except Exception as e:
            raise ValueError(f"Error generating log summary: {str(e)}")

    async def get_user_activity_count(self, user_id: int, days: int = 30) -> int:
        """
        Get the number of activities for a specific user within a given time frame.

        """
        try:
            end_date = datetime.now(datetime.timezone.utc)
            start_date = end_date - timedelta(days=days)

            activity_count = await self.prisma.activitylog.count(
                where={
                    "user_id": user_id,
                    "timestamp": {"gte": start_date, "lte": end_date},
                }
            )
            return activity_count
        except Exception as e:
            raise ValueError(f"Error retrieving user activity count: {str(e)}")
