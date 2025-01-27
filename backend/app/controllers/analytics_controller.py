# app/controllers/analytics_controller.py
from typing import Dict, List
from app.services.analytics_service import AnalyticsService
from app.schemas.analytics_schemas import (
    HealthTrendRequestSchema,
    AppointmentStatsRequestSchema,
    UserEngagementRequestSchema,
    AnalyticsResultSchema,
)


class AnalyticsController:
    @staticmethod
    async def generate_health_trends(
        request: HealthTrendRequestSchema,
    ) -> AnalyticsResultSchema:
        """
        Generate health-related trend analytics
        """
        try:
            # Validate and process request parameters
            trends = await AnalyticsService.generate_health_trends(
                trend_type=request.trend_type,
                period=request.period,
                start_date=request.start_date,
                end_date=request.end_date,
                group_by=request.group_by,
            )

            return AnalyticsResultSchema(
                data=trends,
                total_count=len(trends),
                average=AnalyticsService.calculate_average(trends),
                trend=AnalyticsService.determine_trend(trends),
            )

        except Exception as e:
            raise ValueError(f"Error generating health trends: {str(e)}")

    @staticmethod
    async def generate_appointment_stats(
        request: AppointmentStatsRequestSchema,
    ) -> AnalyticsResultSchema:
        """
        Generate appointment-related statistics
        """
        try:
            # Validate and process request parameters
            stats = await AnalyticsService.generate_appointment_stats(
                stat_type=request.stat_type,
                period=request.period,
                start_date=request.start_date,
                end_date=request.end_date,
            )

            return AnalyticsResultSchema(
                data=stats,
                total_count=len(stats),
                average=AnalyticsService.calculate_average(stats),
                trend=AnalyticsService.determine_trend(stats),
            )

        except Exception as e:
            raise ValueError(f"Error generating appointment stats: {str(e)}")

    @staticmethod
    async def analyze_user_engagement(
        request: UserEngagementRequestSchema,
    ) -> AnalyticsResultSchema:
        """
        Analyze user engagement metrics
        """
        try:
            # Validate and process request parameters
            engagement_data = await AnalyticsService.analyze_user_engagement(
                metric=request.metric,
                period=request.period,
                start_date=request.start_date,
                end_date=request.end_date,
            )

            return AnalyticsResultSchema(
                data=engagement_data,
                total_count=len(engagement_data),
                average=AnalyticsService.calculate_average(engagement_data),
                trend=AnalyticsService.determine_trend(engagement_data),
            )

        except Exception as e:
            raise ValueError(f"Error analyzing user engagement: {str(e)}")
