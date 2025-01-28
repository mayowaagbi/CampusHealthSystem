from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User  # Assuming you have a User model
from app.schemas.provider_schemas import (
    PatientRecordSchema,
    AppointmentSchema,
    UpdatePatientSchema,
)
from prisma import Prisma
from app.schemas.provider_schemas import HealthRecordSchema
from app.services.healthcare_provider_service import HealthcareProviderService
from app.middleware.auth import get_current_user, provider_required
from prisma import Prisma

router = APIRouter(prefix="/provider", tags=["Healthcare Provider"])


# Dependency to get the Prisma client
from typing import AsyncGenerator


async def get_prisma() -> AsyncGenerator[Prisma, None]:
    prisma = Prisma()
    await prisma.connect()
    try:
        yield prisma
    finally:
        await prisma.disconnect()


@router.get("/patients/{patient_id}", response_model=PatientRecordSchema)
async def get_patient_record(
    patient_id: int,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Retrieve a patient's health record."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    patient_record = await healthcare_provider_service.get_student_record(patient_id)
    if not patient_record:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record


@router.post("/patients/{patient_id}/appointments", response_model=AppointmentSchema)
async def schedule_appointment(
    patient_id: int,
    appointment_data: AppointmentSchema,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Schedule an appointment for a patient."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    appointment = await healthcare_provider_service.schedule_appointment(
        patient_id, appointment_data
    )
    return appointment


@router.put("/patients/{patient_id}", response_model=PatientRecordSchema)
async def update_patient_info(
    patient_id: int,
    patient_data: UpdatePatientSchema,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Update a patient's information."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    updated_patient = await healthcare_provider_service.update_student_info(
        patient_id, patient_data
    )
    if not updated_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_patient


@router.get(
    "/patients/{patient_id}/appointments", response_model=list[AppointmentSchema]
)
async def get_patient_appointments(
    patient_id: int,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Retrieve all appointments for a patient."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    appointments = await healthcare_provider_service.get_student_appointments(
        patient_id
    )
    return appointments


@router.get("/patients/{patient_id}", response_model=HealthRecordSchema)
async def get_patient_record(
    patient_id: int,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Retrieve a patient's health record."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    patient_record = await healthcare_provider_service.get_student_record(patient_id)
    if not patient_record:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record


@router.post("/patients/{patient_id}/appointments", response_model=AppointmentSchema)
async def schedule_appointment(
    patient_id: int,
    appointment_data: AppointmentSchema,
    current_user: User = Depends(provider_required),
    prisma: Prisma = Depends(get_prisma),  # Inject Prisma client
):
    """Schedule an appointment for a patient."""
    healthcare_provider_service = HealthcareProviderService(
        prisma
    )  # Initialize the service
    appointment = await healthcare_provider_service.schedule_appointment(
        patient_id, appointment_data
    )
    return appointment
