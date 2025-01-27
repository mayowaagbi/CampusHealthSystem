from prisma import Prisma
from app.models import Appointment  # Assuming you have an Appointment model
from app.schemas.provider_schemas import AppointmentSchema


class AppointmentRepository:
    def __init__(self, prisma: Prisma):
        self.prisma = prisma

    async def create_appointment(
        self, patient_id: int, appointment_data: AppointmentSchema
    ):
        """Create a new appointment for a patient."""
        return await self.prisma.appointment.create(
            data={
                "patientId": patient_id,
                "date": appointment_data.date,
                "reason": appointment_data.reason,
                "notes": appointment_data.notes,
            }
        )

    async def get_appointments_by_patient_id(self, patient_id: int):
        """Retrieve all appointments for a specific patient."""
        return await self.prisma.appointment.find_many(where={"patientId": patient_id})
