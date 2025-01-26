# app/controllers/log_controller.py
from typing import List, Dict
from app.services.log_service import LogService
from app.schemas.log_schemas import SystemLogSchema, LogFilterSchema, LogLevel


class LogController:
    @staticmethod
    async def get_system_logs(
        skip: int = 0, limit: int = 100, filters: Optional[LogFilterSchema] = None
    ) -> List[SystemLogSchema]:
        """
        Retrieve system logs with optional filtering

        Args:
            skip (int): Number of logs to skip for pagination
            limit (int): Maximum number of logs to return
            filters (LogFilterSchema): Optional filtering parameters

        Returns:
            List of system logs
        """
        try:
            # Prepare filter parameters
            filter_params = {}
            if filters:
                if filters.start_date:
                    filter_params["start_date"] = filters.start_date
                if filters.end_date:
                    filter_params["end_date"] = filters.end_date
                if filters.level:
                    filter_params["level"] = filters.level
                if filters.source:
                    filter_params["source"] = filters.source
                if filters.user_id:
                    filter_params["user_id"] = filters.user_id

            # Retrieve system logs
            system_logs = await LogService.get_system_logs(
                skip=skip, limit=limit, **filter_params
            )

            return system_logs

        except Exception as e:
            raise ValueError(f"Error retrieving system logs: {str(e)}")

    @staticmethod
    async def get_log_summary(days: int = 7) -> Dict:
        """
        Generate a summary of recent system logs

        Args:
            days (int): Number of days to look back

        Returns:
            Dictionary with log summary
        """
        try:
            summary = await LogService.get_log_summary(days)
            return summary

        except Exception as e:
            raise ValueError(f"Error generating log summary: {str(e)}")

    @staticmethod
    async def create_system_log(
        level: LogLevel,
        message: str,
        source: Optional[str] = None,
        user_id: Optional[int] = None,
        ip_address: Optional[str] = None,
        context: Optional[Dict] = None,
    ) -> SystemLogSchema:
        """
        Create a new system log entry

        Args:
            level (LogLevel): Log level
            message (str): Log message
            source (Optional[str]): Source of the log
            user_id (Optional[int]): User ID associated with the log
            ip_address (Optional[str]): IP address of the user
            context (Optional[Dict]): Additional context for the log

        Returns:
            Created system log entry
        """
        try:
            log_data = {
                "level": level,
                "message": message,
                "source": source,
                "user_id": user_id,
                "ip_address": ip_address,
                "context": context,
            }

            created_log = await LogService.create_system_log(log_data)
            return created_log

        except Exception as e:
            raise ValueError(f"Error creating system log: {str(e)}")
