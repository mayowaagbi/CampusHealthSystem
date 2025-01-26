# app/routes/activity_log_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List

from app.controllers.activity_log_controller import ActivityLogController
from app.schemas.activity_log_schemas import ActivityLogSchema, ActivityLogFilterSchema
from app.middleware.auth import admin_required, get_current_user

router = APIRouter(prefix="/activity-logs", tags=["Activity Logs"])


@router.get("/", response_model=List[ActivityLogSchema])
async def get_activity_logs(
    current_user=Depends(admin_required),
    user_id: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    action: Optional[str] = Query(None),
):
    """
    Retrieve activity logs with optional filtering

    - Requires admin authentication
    - Supports filtering by user, date range, and action
    - Supports pagination
    """
    try:
        # Prepare filters
        filters = ActivityLogFilterSchema(
            user_id=user_id, start_date=start_date, end_date=end_date, action=action
        )

        # Get activity logs
        activity_logs = await ActivityLogController.get_activity_logs(
            skip=skip, limit=limit, filters=filters
        )

        return activity_logs

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/summary")
async def get_activity_log_summary(
    current_user=Depends(admin_required), days: int = Query(7, ge=1, le=30)
):
    """
    Generate a summary of recent activity logs

    - Requires admin authentication
    - Generates summary for specified number of days
    """
    try:
        summary = await ActivityLogController.get_activity_log_summary(days)
        return summary

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
