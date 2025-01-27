from fastapi import APIRouter, Depends, HTTPException
from app.models import User  # Assuming you have a User model
from app.schemas.provider_schemas import (
    PatientRecordSchema,
    AppointmentSchema,
    UpdatePatientSchema,
)
from app.services.healthcare_provider_service import HealthcareProviderService
from app.middleware.auth import get_current_user, provider_required

router = APIRouter(prefix="/provider", tags=["Healthcare Provider"])

# Initialize the service
healthcare_provider_service = HealthcareProviderService()


@router.get("/patients/{patient_id}", response_model=PatientRecordSchema)
async def get_patient_record(
    patient_id: int, current_user: User = Depends(provider_required)
):
    """Retrieve a patient's health record."""
    patient_record = await healthcare_provider_service.get_patient_record(patient_id)
    if not patient_record:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_record


@router.post("/patients/{patient_id}/appointments", response_model=AppointmentSchema)
async def schedule_appointment(
    patient_id: int,
    appointment_data: AppointmentSchema,
    current_user: User = Depends(provider_required),
):
    """Schedule an appointment for a patient."""
    appointment = await healthcare_provider_service.schedule_appointment(
        patient_id, appointment_data
    )
    return appointment


@router.put("/patients/{patient_id}", response_model=PatientRecordSchema)
async def update_patient_info(
    patient_id: int,
    patient_data: UpdatePatientSchema,
    current_user: User = Depends(provider_required),
):
    """Update a patient's information."""
    updated_patient = await healthcare_provider_service.update_patient_info(
        patient_id, patient_data
    )
    if not updated_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated_patient


@router.get(
    "/patients/{patient_id}/appointments", response_model=list[AppointmentSchema]
)
async def get_patient_appointments(
    patient_id: int, current_user: User = Depends(provider_required)
):
    """Retrieve all appointments for a patient."""
    appointments = await healthcare_provider_service.get_patient_appointments(
        patient_id
    )
    return appointments
