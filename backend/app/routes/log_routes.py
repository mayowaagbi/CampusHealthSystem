# app/routes/log_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional, List
from datetime import datetime

from app.controllers.log_controller import LogController
from app.schemas.log_schemas import SystemLogSchema, LogFilterSchema, LogLevel
from app.middleware.auth import admin_required

router = APIRouter(prefix="/logs", tags=["System Logs"])


@router.get("/", response_model=List[SystemLogSchema])
async def get_system_logs(
    current_user=Depends(admin_required),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    level: Optional[LogLevel] = Query(None),
    source: Optional[str] = Query(None),
    user_id: Optional[int] = Query(None),
):
    """
    Retrieve system logs with optional filtering

    - Requires admin authentication
    - Supports filtering by date, log level, source, and user
    - Supports pagination
    """
    try:
        # Prepare filters
        filters = LogFilterSchema(
            start_date=start_date,
            end_date=end_date,
            level=level,
            source=source,
            user_id=user_id,
        )

        # Get system logs
        system_logs = await LogController.get_system_logs(
            skip=skip, limit=limit, filters=filters
        )

        return system_logs

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/summary")
async def get_log_summary(
    current_user=Depends(admin_required), days: int = Query(7, ge=1, le=30)
):
    """
    Generate a summary of recent system logs

    - Requires admin authentication
    - Generates summary for specified number of days
    """
    try:
        summary = await LogController.get_log_summary(days)
        return summary

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
