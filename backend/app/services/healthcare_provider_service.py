# app/services/healthcare_provider_service.py
from prisma import Prisma
from app.schemas.provider_schemas import (
    HealthRecordSchema,
    AppointmentSchema,
    UpdatePatientSchema,
)


class HealthcareProviderService:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma  # Initialize Prisma client

    async def get_student_record(self, student_id: int) -> HealthRecordSchema:
        """Retrieve a student's health record."""
        student_record = await self.prisma.student.find_unique(where={"id": student_id})
        if not student_record:
            raise ValueError(
                f"Student with ID {student_id} not found."
            )  # Raise an exception if preferred
        return HealthRecordSchema(**student_record.dict())  # Convert to schema

    async def schedule_appointment(
        self, student_id: int, appointment_data: AppointmentSchema
    ):
        """Schedule an appointment for a student."""
        appointment = await self.prisma.appointment.create(
            data={
                "student_id": student_id,
                **appointment_data.dict(),  # Assuming appointment_data has the necessary fields
            }
        )
        return appointment

    async def update_student_info(
        self, student_id: int, student_data: UpdatePatientSchema
    ) -> HealthRecordSchema:
        """Update a student's information."""
        updated_student = await self.prisma.student.update(
            where={"id": student_id},
            data=student_data.dict(
                exclude_unset=True
            ),  # Only update fields that are set
        )
        if not updated_student:
            raise ValueError(
                f"Failed to update student with ID {student_id}."
            )  # Raise an exception if preferred
        return HealthRecordSchema(**updated_student.dict())  # Convert to schema

    async def get_student_appointments(self, student_id: int):
        """Retrieve all appointments for a student."""
        appointments = await self.prisma.appointment.find_many(
            where={"student_id": student_id}
        )
        return appointments
