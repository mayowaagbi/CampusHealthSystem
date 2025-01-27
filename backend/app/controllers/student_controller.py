# app/routes/student_routes.py
from fastapi import APIRouter, Depends, HTTPException
from app.controllers.student_controller import StudentController
from app.schemas.student_schemas import (
    StudentProfileUpdateSchema,
    AppointmentCreateSchema,
    MoodLogSchema,
    JournalCreateSchema,
    EmergencyContactCreateSchema,
    EmergencyContactUpdateSchema,
    HelpRequestSchema,
    FeedbackCreateSchema,
)
from app.middleware.auth import get_current_user
from app.services.emergency_contact_service import EmergencyContactService

router = APIRouter(prefix="/student", tags=["Student"])


# Profile Routes
@router.get("/profile")
async def get_profile(current_user=Depends(get_current_user)):
    """Retrieve student profile"""
    try:
        return await StudentController.get_profile(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/profile")
async def update_profile(
    profile_update: StudentProfileUpdateSchema, current_user=Depends(get_current_user)
):
    """Update student profile"""
    try:
        return await StudentController.update_profile(current_user.id, profile_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Appointment Routes
@router.post("/appointments")
async def schedule_appointment(
    appointment: AppointmentCreateSchema, current_user=Depends(get_current_user)
):
    """Schedule a new appointment"""
    try:
        return await StudentController.schedule_appointment(
            current_user.id, appointment
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/appointments/{appointment_id}")
async def cancel_appointment(
    appointment_id: int, current_user=Depends(get_current_user)
):
    """Cancel an existing appointment"""
    try:
        return await StudentController.cancel_appointment(
            current_user.id, appointment_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/appointments")
async def view_appointments(current_user=Depends(get_current_user)):
    """View student's appointments"""
    try:
        return await StudentController.view_appointments(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Health Record Routes
@router.get("/health-records")
async def view_health_records(current_user=Depends(get_current_user)):
    """View student's health records"""
    try:
        return await StudentController.view_health_records(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Mood Tracker Routes
@router.post("/mood-tracker")
async def log_mood(mood_log: MoodLogSchema, current_user=Depends(get_current_user)):
    """Log student's mood"""
    try:
        return await StudentController.log_mood(current_user.id, mood_log)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/mood-tracker")
async def get_moods(current_user=Depends(get_current_user)):
    """Retrieve student's mood logs"""
    try:
        return await StudentController.get_moods(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Journal Routes
@router.post("/journal")
async def create_journal(
    journal: JournalCreateSchema, current_user=Depends(get_current_user)
):
    """Create a journal entry"""
    try:
        return await StudentController.create_journal(current_user.id, journal)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/journal/{journal_id}")
async def delete_journal(journal_id: int, current_user=Depends(get_current_user)):
    """Delete a journal entry"""
    try:
        return await StudentController.delete_journal(current_user.id, journal_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/journal")
async def get_journals(current_user=Depends(get_current_user)):
    """Retrieve student's journal entries"""
    try:
        return await StudentController.get_journals(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Emergency Contact Routes
@router.get("/emergency-contact")
async def get_emergency_contacts(current_user=Depends(get_current_user)):
    """Retrieve emergency contacts"""
    try:
        return await EmergencyContactService.get_emergency_contacts(current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/emergency-contact")
async def create_emergency_contact(
    contact: EmergencyContactCreateSchema, current_user=Depends(get_current_user)
):
    """Create an emergency contact"""
    try:
        return await StudentController.create_emergency_contact(
            current_user.id, contact
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/emergency-contact/{contact_id}")
async def update_emergency_contact(
    contact_id: int,
    contact_update: EmergencyContactUpdateSchema,
    current_user=Depends(get_current_user),
):
    """Update an emergency contact"""
    try:
        return await StudentController.update_emergency_contact(
            current_user.id, contact_id, contact_update
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/emergency-contact/{contact_id}")
async def delete_emergency_contact(
    contact_id: int, current_user=Depends(get_current_user)
):
    """Delete an emergency contact"""
    try:
        return await StudentController.delete_emergency_contact(
            current_user.id, contact_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Help Request Routes
@router.post("/request-help")
async def request_help(
    help_request: HelpRequestSchema, current_user=Depends(get_current_user)
):
    """Request emergency help"""
    try:
        return await StudentController.request_help(current_user.id, help_request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Feedback Routes
@router.post("/feedback")
async def submit_feedback(
    feedback: FeedbackCreateSchema, current_user=Depends(get_current_user)
):
    """Submit feedback"""
    try:
        return await StudentController.submit_feedback(current_user.id, feedback)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
