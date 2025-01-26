# app/services/analytics_service.py
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
from prisma import Prisma
from prisma.errors import RecordNotFoundError
import statistics


class AnalyticsService:
    @staticmethod
    async def generate_health_trends(
        prisma: Prisma,
        trend_type: str,
        period: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        group_by: Optional[str] = None,
    ) -> List[Dict]:
        """
        Generate health trends based on specified parameters

        Args:
            prisma (Prisma): Prisma client
            trend_type (str): Type of health trend (e.g., 'mood', 'diagnosis')
            period (str): Time period for analysis (e.g., 'daily', 'weekly', 'monthly')
            start_date (Optional[datetime]): Start date for analysis
            end_date (Optional[datetime]): End date for analysis
            group_by (Optional[str]): Additional grouping parameter

        Returns:
            List[Dict]: Health trend analysis results
        """
        try:
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = datetime.utcnow()
                start_date = end_date - timedelta(days=30)

            # Health trend analysis logic
            if trend_type == "mood":
                mood_trends = await prisma.moodtracker.group_by(
                    by=["mood"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                    _avg={"rating": True},
                )

                return [
                    {
                        "mood": trend.mood,
                        "count": trend._count.id,
                        "average_rating": trend._avg.rating,
                    }
                    for trend in mood_trends
                ]

            elif trend_type == "diagnosis":
                diagnosis_trends = await prisma.healthrecord.group_by(
                    by=["diagnosis"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                )

                return [
                    {"diagnosis": trend.diagnosis, "count": trend._count.id}
                    for trend in diagnosis_trends
                ]

            else:
                raise ValueError(f"Unsupported trend type: {trend_type}")

        except Exception as e:
            raise ValueError(f"Error generating health trends: {str(e)}")

    @staticmethod
    async def generate_appointment_stats(
        prisma: Prisma,
        stat_type: str,
        period: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[Dict]:
        """
        Generate appointment statistics based on specified parameters

        Args:
            prisma (Prisma): Prisma client
            stat_type (str): Type of appointment statistic
            period (str): Time period for analysis
            start_date (Optional[datetime]): Start date for analysis
            end_date (Optional[datetime]): End date for analysis

        Returns:
            List[Dict]: Appointment statistics
        """
        try:
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = datetime.utcnow()
                start_date = end_date - timedelta(days=30)

            # Appointment statistics analysis
            if stat_type == "status_distribution":
                status_stats = await prisma.appointment.group_by(
                    by=["status"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                )

                return [
                    {"status": stat.status, "count": stat._count.id}
                    for stat in status_stats
                ]

            elif stat_type == "provider_performance":
                provider_stats = await prisma.appointment.group_by(
                    by=["provider_id"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                )

                return [
                    {
                        "provider_id": stat.provider_id,
                        "total_appointments": stat._count.id,
                    }
                    for stat in provider_stats
                ]

            else:
                raise ValueError(f"Unsupported stat type: {stat_type}")

        except Exception as e:
            raise ValueError(f"Error generating appointment stats: {str(e)}")

    @staticmethod
    async def analyze_user_engagement(
        prisma: Prisma,
        metric: str,
        period: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[Dict]:
        """
        Analyze user engagement based on specified parameters

        Args:
            prisma (Prisma): Prisma client
            metric (str): User engagement metric
            period (str): Time period for analysis
            start_date (Optional[datetime]): Start date for analysis
            end_date (Optional[datetime]): End date for analysis

        Returns:
            List[Dict]: User engagement analysis results
        """
        try:
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = datetime.utcnow()
                start_date = end_date - timedelta(days=30)

            # User engagement analysis
            if metric == "journal_entries":
                journal_engagement = await prisma.journal.group_by(
                    by=["student_id"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                )

                return [
                    {"student_id": entry.student_id, "journal_entries": entry._count.id}
                    for entry in journal_engagement
                ]

            elif metric == "mood_tracking":
                mood_tracking = await prisma.moodtracker.group_by(
                    by=["student_id"],
                    where={"created_at": {"gte": start_date, "lte": end_date}},
                    _count={"id": True},
                )

                return [
                    {"student_id": entry.student_id, "mood_entries": entry._count.id}
                    for entry in mood_tracking
                ]

            else:
                raise ValueError(f"Unsupported engagement metric: {metric}")

        except Exception as e:
            raise ValueError(f"Error analyzing user engagement: {str(e)}")

    @staticmethod
    def calculate_average(data: List[Dict]) -> Optional[float]:
        """
        Calculate average from a list of dictionaries

        Args:
            data (List[Dict]): List of data points

        Returns:
            Optional[float]: Average value
        """
        if not data:
            return None

        try:
            values = [entry.get("value", 0) for entry in data]
            return sum(values) / len(values)
        except Exception:
            return None

    @staticmethod
    def determine_trend(data: List[Dict], value_key: str = "value") -> Optional[str]:
        """
        Determine trend from a list of dictionaries

        Args:
            data (List[Dict]): List of data points
            value_key (str): Key to use for trend calculation

        Returns:
            Optional[str]: Trend description
        """
        if not data or len(data) < 2:
            return None

        try:
            # Extract values
            values = [entry.get(value_key, 0) for entry in data]

            # Calculate the differences between consecutive values
            differences = [values[i] - values[i - 1] for i in range(1, len(values))]

            # Determine the trend based on the differences
            positive_trend = sum(1 for diff in differences if diff > 0)
            negative_trend = sum(1 for diff in differences if diff < 0)

            if positive_trend > negative_trend:
                return "Increasing"
            elif negative_trend > positive_trend:
                return "Decreasing"
            else:
                return "Stable"

        except Exception:
            return None

    @staticmethod
    def calculate_average(data: List[Dict]) -> Optional[float]:
        """
        Calculate average from a list of dictionaries

        Args:
            data (List[Dict]): List of data points

        Returns:
            Optional[float]: Average value
        """
        if not data:
            return None

        try:
            values = [entry.get("value", 0) for entry in data]
            return sum(values) / len(values)
        except Exception:
            return None

    @staticmethod
    def determine_trend(data: List[Dict], value_key: str = "value") -> Optional[str]:
        """
        Determine trend from a list of dictionaries

        Args:
            data (List[Dict]): List of data points
            value_key (str): Key to use for trend calculation

        Returns:
            Optional[str]: Trend description
        """
        if not data or len(data) < 2:
            return None

        try:
            # Extract values
            values = [entry.get(value_key, 0) for entry in data]

            # Calculate trend indicators
            try:
                slope = AnalyticsService._calculate_trend_slope(values)
            except Exception:
                return "Insufficient data"

            # Determine trend description
            if slope > 0.1:
                return "Increasing"
            elif slope < -0.1:
                return "Decreasing"
            else:
                return "Stable"

        except Exception:
            return None

    @staticmethod
    def _calculate_trend_slope(values: List[float]) -> float:
        """
        Calculate the slope of the trend line using linear regression

        Args:
            values (List[float]): List of numeric values

        Returns:
            float: Slope of the trend line
        """
        if len(values) < 2:
            raise ValueError("Insufficient data points")

        # Use linear regression to calculate slope
        x = list(range(len(values)))
        y = values

        # Calculate means
        x_mean = statistics.mean(x)
        y_mean = statistics.mean(y)

        # Calculate slope
        numerator = sum((x_i - x_mean) * (y_i - y_mean) for x_i, y_i in zip(x, y))
        denominator = sum((x_i - x_mean) ** 2 for x_i in x)

        return numerator / denominator if denominator != 0 else 0

    @staticmethod
    async def generate_comprehensive_report(
        prisma: Prisma,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive analytics report

        Args:
            prisma (Prisma): Prisma client
            start_date (Optional[datetime]): Start date for analysis
            end_date (Optional[datetime]): End date for analysis

        Returns:
            Dict[str, Any]: Comprehensive analytics report
        """
        try:
            # Set default date range if not provided
            if not start_date or not end_date:
                end_date = datetime.utcnow()
                start_date = end_date - timedelta(days=30)

            # Collect various analytics
            health_trends = await AnalyticsService.generate_health_trends(
                prisma, "mood", "monthly", start_date, end_date
            )
            appointment_stats = await AnalyticsService.generate_appointment_stats(
                prisma, "status_distribution", "monthly", start_date, end_date
            )
            user_engagement = await AnalyticsService.analyze_user_engagement(
                prisma, "journal_entries", "monthly", start_date, end_date
            )

            # Analyze trends
            mood_trend = AnalyticsService.determine_trend(
                [{"value": trend["count"]} for trend in health_trends]
            )
            appointment_trend = AnalyticsService.determine_trend(
                [{"value": stat["count"]} for stat in appointment_stats]
            )
            engagement_trend = AnalyticsService.determine_trend(
                [{"value": entry["journal_entries"]} for entry in user_engagement]
            )

            return {
                "period": {"start_date": start_date, "end_date": end_date},
                "health_trends": {"data": health_trends, "trend": mood_trend},
                "appointment_stats": {
                    "data": appointment_stats,
                    "trend": appointment_trend,
                },
                "user_engagement": {"data": user_engagement, "trend": engagement_trend},
            }

        except Exception as e:
            raise ValueError(f"Error generating comprehensive report: {str(e)}")
