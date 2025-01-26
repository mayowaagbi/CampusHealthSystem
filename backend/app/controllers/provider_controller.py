# app/controllers/provider_controller.py
from typing import List, Optional
from datetime import datetime

from app.services.appointment_service import AppointmentService
from app.services.health_record_service import HealthRecordService
from app.services.prescription_service import PrescriptionService
from app.services.feedback_service import FeedbackService
from app.services.health_alert_service import HealthAlertService

from app.schemas.provider_schemas import (
    AppointmentCreateSchema,
    AppointmentUpdateSchema,
    HealthRecordCreateSchema,
    HealthRecordUpdateSchema,
    PrescriptionCreateSchema,
    HealthAlertCreateSchema,
    AppointmentSchema,
    HealthRecordSchema,
    FeedbackSchema,
    HealthAlertSchema,
)


class ProviderController:
    @staticmethod
    async def get_appointments(
        provider_id: int,
        status: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> List[AppointmentSchema]:
        """
        Retrieve provider's appointments

        Args:
            provider_id (int): ID of the healthcare provider
            status (Optional[str]): Filter by appointment status
            start_date (Optional[datetime]): Start date filter
            end_date (Optional[datetime]): End date filter

        Returns:
            List of appointments
        """
        try:
            return await AppointmentService.get_provider_appointments(
                provider_id, status=status, start_date=start_date, end_date=end_date
            )
        except Exception as e:
            raise ValueError(f"Error retrieving appointments: {str(e)}")

    @staticmethod
    async def create_appointment(
        provider_id: int, appointment_data: AppointmentCreateSchema
    ) -> AppointmentSchema:
        """Create a new appointment"""
        try:
            return await AppointmentService.create_appointment(
                provider_id, appointment_data
            )
        except Exception as e:
            raise ValueError(f"Error creating appointment: {str(e)}")

    @staticmethod
    async def update_appointment(
        appointment_id: int,
        provider_id: int,
        appointment_update: AppointmentUpdateSchema,
    ) -> AppointmentSchema:
        """Update an existing appointment"""
        try:
            return await AppointmentService.update_appointment(
                appointment_id, provider_id, appointment_update
            )
        except Exception as e:
            raise ValueError(f"Error updating appointment: {str(e)}")

    @staticmethod
    async def delete_appointment(appointment_id: int, provider_id: int) -> dict:
        """Delete an appointment"""
        try:
            return await AppointmentService.delete_appointment(
                appointment_id, provider_id
            )
        except Exception as e:
            raise ValueError(f"Error deleting appointment: {str(e)}")

    @staticmethod
    async def create_health_record(
        provider_id: int, health_record_data: HealthRecordCreateSchema
    ) -> HealthRecordSchema:
        """Create a new health record"""
        try:
            return await HealthRecordService.create_health_record(
                provider_id, health_record_data
            )
        except Exception as e:
            raise ValueError(f"Error creating health record: {str(e)}")

    @staticmethod
    async def update_health_record(
        record_id: int, provider_id: int, health_record_update: HealthRecordUpdateSchema
    ) -> HealthRecordSchema:
        """Update an existing health record"""
        try:
            return await HealthRecordService.update_health_record(
                record_id, provider_id, health_record_update
            )
        except Exception as e:
            raise ValueError(f"Error updating health record: {str(e)}")

    @staticmethod
    async def view_feedback(
        provider_id: int, student_id: Optional[int] = None
    ) -> List[FeedbackSchema]:
        """View student feedback"""
        try:
            return await FeedbackService.get_feedback_by_provider(
                provider_id, student_id
            )
        except Exception as e:
            raise ValueError(f"Error retrieving feedback: {str(e)}")

    @staticmethod
    async def create_health_alert(
        provider_id: int, health_alert_data: HealthAlertCreateSchema
    ) -> HealthAlertSchema:
        """Create a new health alert"""
        try:
            return await HealthAlertService.create_health_alert(
                provider_id, health_alert_data
            )
        except Exception as e:
            raise ValueError(f"Error creating health alert: {str(e)}")
