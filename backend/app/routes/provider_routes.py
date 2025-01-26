# app/routes/provider_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from datetime import datetime

from app.controllers.provider_controller import ProviderController
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
from app.middleware.auth import provider_required, get_current_user

router = APIRouter(prefix="/provider", tags=["Healthcare Provider"])


# Appointment Routes
@router.get("/appointments", response_model=List[AppointmentSchema])
async def get_appointments(
    current_user=Depends(provider_required),
    status: Optional[str] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
):
    """
    Retrieve provider's appointments

    Supports filtering by status and date range
    """
    try:
        return await ProviderController.get_appointments(
            current_user.id, status=status, start_date=start_date, end_date=end_date
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/appointments", response_model=AppointmentSchema)
async def create_appointment(
    appointment: AppointmentCreateSchema, current_user=Depends(provider_required)
):
    """Create a new appointment"""
    try:
        return await ProviderController.create_appointment(current_user.id, appointment)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/appointments/{appointment_id}", response_model=AppointmentSchema)
async def update_appointment(
    appointment_id: int,
    appointment_update: AppointmentUpdateSchema,
    current_user=Depends(provider_required),
):
    """Update an existing appointment"""
    try:
        return await ProviderController.update_appointment(
            appointment_id, current_user.id, appointment_update
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int, current_user=Depends(provider_required)
):
    """Delete an appointment"""
    try:
        return await ProviderController.delete_appointment(
            appointment_id, current_user.id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Health Record Routes
@router.post("/health-records", response_model=HealthRecordSchema)
async def create_health_record(
    health_record: HealthRecordCreateSchema, current_user=Depends(provider_required)
):
    """Create a new health record"""
    try:
        return await ProviderController.create_health_record(
            current_user.id, health_record
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/health-records/{record_id}", response_model=HealthRecordSchema)
async def update_health_record(
    record_id: int,
    health_record_update: HealthRecordUpdateSchema,
    current_user=Depends(provider_required),
):
    """Update an existing health record"""
    try:
        return await ProviderController.update_health_record(
            record_id, current_user.id, health_record_update
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Prescription Routes
@router.post("/prescriptions")
async def create_prescription(
    prescription: PrescriptionCreateSchema, current_user=Depends(provider_required)
):
    """Create a new prescription"""
    try:
        return await ProviderController.create_prescription(
            current_user.id, prescription
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Feedback Routes
@router.get("/feedback", response_model=List[FeedbackSchema])
async def view_feedback(
    current_user=Depends(provider_required), student_id: Optional[int] = Query(None)
):
    """
    View student feedback

    Optionally filter by student
    """
    try:
        return await ProviderController.view_feedback(
            current_user.id, student_id=student_id
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Health Alert Routes
@router.post("/health-alerts", response_model=HealthAlertSchema)
async def create_health_alert(
    health_alert: HealthAlertCreateSchema, current_user=Depends(provider_required)
):
    """Create a new health alert"""
    try:
        return await ProviderController.create_health_alert(
            current_user.id, health_alert
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
