# app/services/log_service.py
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.log_schemas import SystemLogSchema, LogSummarySchema
from app.repositories.log_repository import LogRepository


class LogService:
    @staticmethod
    async def get_system_logs(
        prisma: Prisma,
        skip: int = 0,
        limit: int = 100,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        level: Optional[str] = None,
        source: Optional[str] = None,
        user_id: Optional[int] = None,
    ) -> List[SystemLogSchema]:
        """
        Retrieve system logs with optional filtering

        Args:
            prisma (Prisma): Prisma client
            skip (int): Number of logs to skip
            limit (int): Maximum number of logs to return
            start_date (Optional[datetime]): Start of date range
            end_date (Optional[datetime]): End of date range
            level (Optional[str]): Log level filter
            source (Optional[str]): Source filter
            user_id (Optional[int]): User ID filter

        Returns:
            List of system logs
        """
        try:
            filters = {}
            if start_date and end_date:
                filters["created_at"] = {"gte": start_date, "lte": end_date}
            if level:
                filters["level"] = level
            if source:
                filters["source"] = source
            if user_id:
                filters["user_id"] = user_id

            logs = await prisma.systemlog.find_many(
                where=filters,
                skip=skip,
                take=limit,
                order_by={"created_at": "desc"},  # Order by creation date
            )

            return [SystemLogSchema.from_orm(log) for log in logs]

        except Exception as e:
            raise ValueError(f"Error retrieving system logs: {str(e)}")

    @staticmethod
    async def get_log_summary(prisma: Prisma, days: int) -> LogSummarySchema:
        """
        Generate a summary of recent system logs

        Args:
            prisma (Prisma): Prisma client
            days (int): Number of days to look back

        Returns:
            LogSummarySchema: Summary of logs
        """
        try:
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            summary = await LogRepository.get_log_summary(prisma, start_date, end_date)
            return LogSummarySchema.from_orm(summary)

        except Exception as e:
            raise ValueError(f"Error generating log summary: {str(e)}")

    @staticmethod
    async def create_system_log(
        prisma: Prisma, log_data: Dict[str, Any]
    ) -> SystemLogSchema:
        """
        Create a new system log entry

        Args:
            prisma (Prisma): Prisma client
            log_data (Dict): Data for the new log entry

        Returns:
            SystemLogSchema: Created system log entry
        """
        try:
            new_log = await prisma.systemlog.create(data=log_data)
            return SystemLogSchema.from_orm(new_log)

        except Exception as e:
            raise ValueError(f"Error creating system log: {str(e)}")
