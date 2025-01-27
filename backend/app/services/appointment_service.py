from typing import List, Dict, Optional
from prisma import Prisma
from prisma.errors import RecordNotFoundError
from app.schemas.student_schemas import AppointmentCreateSchema, AppointmentSchema


class AppointmentService:
    @staticmethod
    async def create_appointment(
        prisma: Prisma, student_id: int, appointment_data: AppointmentCreateSchema
    ) -> AppointmentSchema:
        """
        Schedule a new appointment.

        Args:
            prisma (Prisma): Prisma client.
            student_id (int): ID of the student.
            appointment_data (AppointmentCreateSchema): Appointment details.

        Returns:
            AppointmentSchema: Created appointment details.

        Raises:
            ValueError: If appointment details are invalid or if an error occurs during creation.
        """
        # Validate appointment data
        if not appointment_data.provider_id or not appointment_data.date:
            raise ValueError("Provider ID and date are required.")

        try:
            # Create appointment in the database
            appointment = await prisma.appointment.create(
                data={
                    "student_id": student_id,
                    "provider_id": appointment_data.provider_id,
                    "date": appointment_data.date,
                    "status": "PENDING",
                }
            )
            return AppointmentSchema.from_orm(appointment)

        except Exception as e:
            raise ValueError(f"Error scheduling appointment: {str(e)}")

    @staticmethod
    async def cancel_appointment(
        prisma: Prisma, student_id: int, appointment_id: int
    ) -> Dict[str, str]:
        """
        Cancel an existing appointment.

        Args:
            prisma (Prisma): Prisma client.
            student_id (int): ID of the student.
            appointment_id (int): ID of the appointment to cancel.

        Returns:
            Dict[str, str]: Confirmation message.

        Raises:
            ValueError: If the appointment is not found or if an error occurs during cancellation.
        """
        try:
            # Find the appointment
            appointment = await prisma.appointment.find_unique(
                where={"id": appointment_id, "student_id": student_id}
            )

            if not appointment:
                raise ValueError("Appointment not found.")

            # Update appointment status to 'CANCELLED'
            await prisma.appointment.update(
                where={"id": appointment_id}, data={"status": "CANCELLED"}
            )

            return {"message": "Appointment cancelled successfully."}

        except RecordNotFoundError:
            raise ValueError("Appointment not found.")
        except Exception as e:
            raise ValueError(f"Error canceling appointment: {str(e)}")

    @staticmethod
    async def get_student_appointments(
        prisma: Prisma,
        student_id: int,
        status: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> List[AppointmentSchema]:
        """
        Retrieve student's appointments.

        Args:
            prisma (Prisma): Prisma client.
            student_id (int): ID of the student.
            status (Optional[str]): Filter by appointment status.
            start_date (Optional[str]): Filter by start date.
            end_date (Optional[str]): Filter by end date.

        Returns:
            List[AppointmentSchema]: List of appointments for the student.

        Raises:
            ValueError: If an error occurs during retrieval.
        """
        try:
            # Build query with optional filters
            query = prisma.appointment.find_many(
                where={"student_id": student_id},
                order_by={"date": "asc"},  # Order by date
            )

            # Apply filters if provided
            if status:
                query = query.where({"status": status})

            if start_date:
                query = query.where({"date": {"gte": start_date}})

            if end_date:
                query = query.where({"date": {"lte": end_date}})

            appointments = await query

            return [AppointmentSchema.from_orm(appt) for appt in appointments]

        except Exception as e:
            raise ValueError(f"Error retrieving appointments: {str(e)}")
