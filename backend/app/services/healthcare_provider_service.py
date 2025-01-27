from app.repositories.patient_repository import (
    PatientRepository,
)  # Import the PatientRepository
from app.repositories.appointment_repository import (
    AppointmentRepository,
)  # Import the AppointmentRepository
from app.schemas.provider_schemas import (
    PatientRecordSchema,
    AppointmentSchema,
    UpdatePatientSchema,
)


class HealthcareProviderService:
    def __init__(self):
        self.patient_repo = PatientRepository()  # Initialize the patient repository
        self.appointment_repo = (
            AppointmentRepository()
        )  # Initialize the appointment repository

    async def get_patient_record(self, patient_id: int) -> PatientRecordSchema:
        """Retrieve a patient's health record."""
        patient_record = await self.patient_repo.get_patient_by_id(patient_id)
        if not patient_record:
            return None  # Or raise an exception if preferred
        return PatientRecordSchema(**patient_record.dict())  # Convert to schema

    async def schedule_appointment(
        self, patient_id: int, appointment_data: AppointmentSchema
    ):
        """Schedule an appointment for a patient."""
        appointment = await self.appointment_repo.create_appointment(
            patient_id, appointment_data
        )
        return appointment

    async def update_patient_info(
        self, patient_id: int, patient_data: UpdatePatientSchema
    ) -> PatientRecordSchema:
        """Update a patient's information."""
        updated_patient = await self.patient_repo.update_patient(
            patient_id, patient_data
        )
        if not updated_patient:
            return None  # Or raise an exception if preferred
        return PatientRecordSchema(**updated_patient.dict())  # Convert to schema

    async def get_patient_appointments(self, patient_id: int):
        """Retrieve all appointments for a patient."""
        appointments = await self.appointment_repo.get_appointments_by_patient_id(
            patient_id
        )
        return appointments
