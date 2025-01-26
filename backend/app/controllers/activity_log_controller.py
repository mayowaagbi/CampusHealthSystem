# app/controllers/activity_log_controller.py
from typing import List, Dict
from app.services.activity_log_service import ActivityLogService
from app.schemas.activity_log_schemas import ActivityLogSchema, ActivityLogFilterSchema


class ActivityLogController:
    @staticmethod
    async def get_activity_logs(
        user_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[ActivityLogFilterSchema] = None,
    ) -> List[ActivityLogSchema]:
        """
        Retrieve activity logs with optional filtering

        Args:
            user_id (Optional[int]): Filter logs by specific user
            skip (int): Number of logs to skip for pagination
            limit (int): Maximum number of logs to return
            filters (ActivityLogFilterSchema): Additional filtering options

        Returns:
            List of activity logs
        """
        try:
            # Prepare filter parameters
            filter_params = {}
            if filters:
                if filters.user_id:
                    filter_params["user_id"] = filters.user_id
                if filters.start_date:
                    filter_params["start_date"] = filters.start_date
                if filters.end_date:
                    filter_params["end_date"] = filters.end_date
                if filters.action:
                    filter_params["action"] = filters.action

            # Retrieve activity logs
            activity_logs = await ActivityLogService.get_activity_logs(
                skip=skip, limit=limit, **filter_params
            )

            return activity_logs

        except Exception as e:
            raise ValueError(f"Error retrieving activity logs: {str(e)}")

    @staticmethod
    async def get_activity_log_summary(days: int = 7) -> Dict:
        """
        Generate a summary of recent activity logs

        Args:
            days (int): Number of days to look back

        Returns:
            Dictionary with activity log summary
        """
        try:
            summary = await ActivityLogService.get_activity_log_summary(days)
            return summary

        except Exception as e:
            raise ValueError(f"Error generating activity log summary: {str(e)}")
