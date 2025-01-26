# app/routes/analytics_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from datetime import datetime

from app.controllers.analytics_controller import AnalyticsController
from app.schemas.analytics_schemas import (
    HealthTrendType,
    AppointmentStatType,
    UserEngagementMetric,
    AnalyticsPeriod,
    HealthTrendRequestSchema,
    AppointmentStatsRequestSchema,
    UserEngagementRequestSchema,
    AnalyticsResultSchema,
)
from app.middleware.auth import admin_required, get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/health-trends", response_model=AnalyticsResultSchema)
async def get_health_trends(
    current_user=Depends(admin_required),
    trend_type: HealthTrendType = Query(...),
    period: AnalyticsPeriod = Query(AnalyticsPeriod.MONTHLY),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    group_by: Optional[str] = Query(None),
):
    """
    Generate health-related trend analytics

    - Requires admin authentication
    - Supports various health trend types and periods
    """
    try:
        request = HealthTrendRequestSchema(
            trend_type=trend_type,
            period=period,
            start_date=start_date,
            end_date=end_date,
            group_by=group_by,
        )

        health_trends = await AnalyticsController.generate_health_trends(request)
        return health_trends

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/appointment-stats", response_model=AnalyticsResultSchema)
async def get_appointment_stats(
    current_user=Depends(admin_required),
    stat_type: AppointmentStatType = Query(...),
    period: AnalyticsPeriod = Query(AnalyticsPeriod.MONTHLY),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
):
    """
    Generate appointment-related statistics

    - Requires admin authentication
    - Supports various appointment stat types and periods
    """
    try:
        request = AppointmentStatsRequestSchema(
            stat_type=stat_type, period=period, start_date=start_date, end_date=end_date
        )

        appointment_stats = await AnalyticsController.generate_appointment_stats(
            request
        )
        return appointment_stats

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/user-engagement", response_model=AnalyticsResultSchema)
async def analyze_user_engagement(
    current_user=Depends(admin_required),
    metric: UserEngagementMetric = Query(...),
    period: AnalyticsPeriod = Query(AnalyticsPeriod.MONTHLY),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
):
    """
    Analyze user engagement metrics

    - Requires admin authentication
    - Supports various user engagement metrics and periods
    """
    try:
        request = UserEngagementRequestSchema(
            metric=metric, period=period, start_date=start_date, end_date=end_date
        )

        user_engagement = await AnalyticsController.analyze_user_engagement(request)
        return user_engagement

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
