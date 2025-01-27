from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User  # Assuming you have a User model
from app.schemas.appointment_schemas import AppointmentSchema, UpdateAppointmentSchema
from app.services.appointment_service import AppointmentService
from app.middleware.auth import get_current_user, provider_required

router = APIRouter(prefix="/appointments", tags=["Appointments"])

# Initialize the service
appointment_service = AppointmentService()


@router.post("/", response_model=AppointmentSchema)
async def schedule_appointment(
    appointment_data: AppointmentSchema, current_user: User = Depends(provider_required)
):
    """Schedule a new appointment."""
    appointment = await appointment_service.schedule_appointment(appointment_data)
    return appointment


@router.get("/{appointment_id}", response_model=AppointmentSchema)
async def get_appointment(
    appointment_id: int, current_user: User = Depends(provider_required)
):
    """Retrieve an appointment by ID."""
    appointment = await appointment_service.get_appointment(appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.put("/{appointment_id}", response_model=AppointmentSchema)
async def update_appointment(
    appointment_id: int,
    appointment_data: UpdateAppointmentSchema,
    current_user: User = Depends(provider_required),
):
    """Update an existing appointment."""
    updated_appointment = await appointment_service.update_appointment(
        appointment_id, appointment_data
    )
    if not updated_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated_appointment


@router.delete("/{appointment_id}", response_model=dict)
async def cancel_appointment(
    appointment_id: int, current_user: User = Depends(provider_required)
):
    """Cancel an appointment."""
    result = await appointment_service.cancel_appointment(appointment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"detail": "Appointment canceled successfully"}
