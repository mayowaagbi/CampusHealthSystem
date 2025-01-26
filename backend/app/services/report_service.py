# app/services/report_service.py
from typing import Dict, List, Optional
from datetime import datetime
from prisma import Prisma

from app.utils.date_utils import get_date_range


class ReportService:
    @staticmethod
    async def generate_report(
        prisma: Prisma,
        report_type: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict:
        """
        Generate system reports based on report type

        Args:
            prisma (Prisma): Prisma client
            report_type (str): Type of report to generate
            start_date (Optional[datetime]): Start date for report
            end_date (Optional[datetime]): End date for report

        Returns:
            Dict containing report data
        """
        try:
            # Set default date range if not provided
            if not start_date or not end_date:
                start_date, end_date = get_date_range(report_type)

            # Generate report based on type
            if report_type == "summary":
                return await ReportService._generate_summary_report(
                    prisma, start_date, end_date
                )
            elif report_type == "user_activity":
                return await ReportService._generate_user_activity_report(
                    prisma, start_date, end_date
                )
            elif report_type == "health_trends":
                return await ReportService._generate_health_trends_report(
                    prisma, start_date, end_date
                )
            elif report_type == "appointment_stats":
                return await ReportService._generate_appointment_stats_report(
                    prisma, start_date, end_date
                )
            else:
                raise ValueError(f"Unsupported report type: {report_type}")

        except Exception as e:
            raise ValueError(f"Error generating report: {str(e)}")

    @staticmethod
    async def _generate_summary_report(
        prisma: Prisma, start_date: datetime, end_date: datetime
    ) -> Dict:
        """
        Generate a comprehensive summary report

        Args:
            prisma (Prisma): Prisma client
            start_date (datetime): Start date for report
            end_date (datetime): End date for report

        Returns:
            Dict with summary report data
        """
        try:
            # User statistics
            total_users = await prisma.user.count(
                where={"created_at": {"gte": start_date, "lte": end_date}}
            )

            new_users = await prisma.user.count(
                where={"created_at": {"gte": start_date, "lte": end_date}}
            )

            # Appointment statistics
            total_appointments = await prisma.appointment.count(
                where={"created_at": {"gte": start_date, "lte": end_date}}
            )

            completed_appointments = await prisma.appointment.count(
                where={
                    "created_at": {"gte": start_date, "lte": end_date},
                    "status": "COMPLETED",
                }
            )

            # Health record statistics
            total_health_records = await prisma.healthrecord.count(
                where={"created_at": {"gte": start_date, "lte": end_date}}
            )

            return {
                "report_type": "summary",
                "start_date": start_date,
                "end_date": end_date,
                "users": {"total": total_users, "new": new_users},
                "appointments": {
                    "total": total_appointments,
                    "completed": completed_appointments,
                },
                "health_records": {"total": total_health_records},
            }

        except Exception as e:
            raise ValueError(f"Error generating summary report: {str(e)}")

    @staticmethod
    async def _generate_user_activity_report(
        prisma: Prisma, start_date: datetime, end_date: datetime
    ) -> Dict:
        """
        Generate a user activity report

        Args:
            prisma (Prisma): Prisma client
            start_date (datetime): Start date for report
            end_date (datetime): End date for report

        Returns:
            Dict with user activity report data
        """
        try:
            # Mood tracking activity
            mood_activity = await prisma.moodtracker.group_by(
                by=["mood"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            # Journal entry activity
            journal_activity = await prisma.journal.group_by(
                by=["student_id"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            return {
                "report_type": "user_activity",
                "start_date": start_date,
                "end_date": end_date,
                "mood_tracking": [
                    {"mood": mood.mood, "count": mood._count.id}
                    for mood in mood_activity
                ],
                "journal_entries": [
                    {"student_id": journal.student_id, "count": journal._count.id}
                    for journal in journal_activity
                ],
            }

        except Exception as e:
            raise ValueError(f"Error generating user activity report: {str(e)}")

    @staticmethod
    async def _generate_health_trends_report(
        prisma: Prisma, start_date: datetime, end_date: datetime
    ) -> Dict:
        """
        Generate a health trends report

        Args:
            prisma (Prisma): Prisma client
            start_date (datetime): Start date for report
            end_date (datetime): End date for report

        Returns:
            Dict with health trends report data
        """
        try:
            # Mood trends
            mood_trends = await prisma.moodtracker.group_by(
                by=["mood"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            # Health record trends
            health_record_trends = await prisma.healthrecord.group_by(
                by=["diagnosis"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            return {
                "report_type": "health_trends",
                "start_date": start_date,
                "end_date": end_date,
                "mood_trends": [
                    {"mood": mood.mood, "count": mood._count.id} for mood in mood_trends
                ],
                "health_record_trends": [
                    {"diagnosis": record.diagnosis, "count": record._count.id}
                    for record in health_record_trends
                ],
            }

        except Exception as e:
            raise ValueError(f"Error generating health trends report: {str(e)}")

    @staticmethod
    async def _generate_appointment_stats_report(
        prisma: Prisma, start_date: datetime, end_date: datetime
    ) -> Dict:
        """
        Generate an appointment statistics report

        Args:
            prisma (Prisma): Prisma client
            start_date (datetime): Start date for report
            end_date (datetime): End date for report

        Returns:
            Dict with appointment stats report data
        """
        try:
            # Appointment status distribution
            status_distribution = await prisma.appointment.group_by(
                by=["status"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            # Provider-wise appointment statistics
            provider_stats = await prisma.appointment.group_by(
                by=["provider_id"],
                where={"created_at": {"gte": start_date, "lte": end_date}},
                _count={"id": True},
            )

            return {
                "report_type": "appointment_stats",
                "start_date": start_date,
                "end_date": end_date,
                "status_distribution": [
                    {"status": status.status, "count": status._count.id}
                    for status in status_distribution
                ],
                "provider_stats": [
                    {"provider_id": stat.provider_id, "count": stat._count.id}
                    for stat in provider_stats
                ],
            }

        except Exception as e:
            raise ValueError(f"Error generating appointment stats report: {str(e)}")
