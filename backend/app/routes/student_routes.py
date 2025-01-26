from fastapi import APIRouter, Depends, HTTPException, status, Query
from prisma import Prisma
from typing import List, Optional

from app.services.student_service import StudentService
from app.schemas.student_schemas import (
    StudentProfileUpdateSchema,
    AppointmentCreateSchema,
    MoodLogSchema,
    JournalCreateSchema,
    EmergencyContactCreateSchema,
    EmergencyContactUpdateSchema,
    HelpRequestSchema,
    FeedbackCreateSchema,
    StudentProfileSchema,
    AppointmentSchema,
    MoodLogResponseSchema,
    JournalSchema,
)
from app.middleware.auth import get_current_user
from app.dependencies import get_prisma

router = APIRouter(prefix="/student", tags=["Student"])


# Profile Routes
@router.get("/profile", response_model=StudentProfileSchema)
async def get_profile(
    current_user: dict = Depends(get_current_user), prisma: Prisma = Depends(get_prisma)
):
    """
    Retrieve student profile

    Requires authentication
    Returns detailed student profile
    """
    try:
        profile = await StudentService.get_student_profile(
            student_id=current_user["id"], prisma=prisma
        )
        return profile
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.put("/profile", response_model=StudentProfileSchema)
async def update_profile(
    profile_update: StudentProfileUpdateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Update student profile

    Requires authentication
    Allows partial update of student profile
    """
    try:
        updated_profile = await StudentService.update_student_profile(
            student_id=current_user["id"], profile_data=profile_update, prisma=prisma
        )
        return updated_profile
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Appointment Routes
@router.post("/appointments", response_model=AppointmentSchema)
async def schedule_appointment(
    appointment: AppointmentCreateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Schedule a new appointment

    Requires authentication
    Validates appointment creation
    """
    try:
        scheduled_appointment = await StudentService.schedule_appointment(
            student_id=current_user["id"], appointment_data=appointment, prisma=prisma
        )
        return scheduled_appointment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/appointments", response_model=List[AppointmentSchema])
async def get_appointments(
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
    status: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
):
    """
    Retrieve student's appointments

    Requires authentication
    Supports filtering by status, start, and end dates
    """
    try:
        appointments = await StudentService.get_student_appointments(
            student_id=current_user["id"],
            prisma=prisma,
            status=status,
            start_date=start_date,
            end_date=end_date,
        )
        return appointments
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/appointments/{appointment_id}")
async def cancel_appointment(
    appointment_id: int,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Cancel an appointment

    Requires authentication
    Checks appointment ownership
    """
    try:
        result = await StudentService.cancel_appointment(
            student_id=current_user["id"], appointment_id=appointment_id, prisma=prisma
        )
        return {"message": "Appointment cancelled successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Mood Tracker Routes
@router.post("/mood", response_model=MoodLogResponseSchema)
async def log_mood(
    mood_log: MoodLogSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Log student's mood

    Requires authentication
    Validates mood log data
    """
    try:
        logged_mood = await StudentService.log_mood(
            student_id=current_user["id"], mood_data=mood_log, prisma=prisma
        )
        return logged_mood
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/mood", response_model=List[MoodLogResponseSchema])
async def get_mood_logs(
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
    days: int = Query(30, ge=1, le=365),
):
    """
    Retrieve student's mood logs

    Requires authentication
    Supports filtering by number of days
    Validates days parameter
    """
    try:
        mood_logs = await StudentService.get_mood_logs(
            student_id=current_user["id"], prisma=prisma, days=days
        )
        return mood_logs
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Journal Routes
@router.post("/journal", response_model=JournalSchema)
async def create_journal(
    journal: JournalCreateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Create a journal entry

    Requires authentication
    Validates journal data
    """
    try:
        created_journal = await StudentService.create_journal(
            student_id=current_user["id"], journal_data=journal, prisma=prisma
        )
        return created_journal
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/journal", response_model=List[JournalSchema])
async def get_journals(
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
    days: int = Query(30, ge=1, le=365),
):
    """
    Retrieve student's journal entries

    Requires authentication
    Supports filtering by number of days
    Validates days parameter
    """
    try:
        journals = await StudentService.get_journals(
            student_id=current_user["id"], prisma=prisma, days=days
        )
        return journals
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Emergency Contact Routes
@router.post("/emergency-contacts", response_model=dict)
async def create_emergency_contact(
    contact: EmergencyContactCreateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Create an emergency contact

    Requires authentication
    Validates contact data
    """
    try:
        created_contact = await StudentService.create_emergency_contact(
            student_id=current_user["id"], contact_data=contact, prisma=prisma
        )
        return created_contact
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.put("/emergency-contacts/{contact_id}", response_model=dict)
async def update_emergency_contact(
    contact_id: int,
    contact_update: EmergencyContactUpdateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Update an emergency contact

    Requires authentication
    Validates contact update data
    """
    try:
        updated_contact = await StudentService.update_emergency_contact(
            student_id=current_user["id"],
            contact_id=contact_id,
            contact_data=contact_update,
            prisma=prisma,
        )
        return updated_contact
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/emergency-contacts/{contact_id}")
async def delete_emergency_contact(
    contact_id: int,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Delete an emergency contact

    Requires authentication
    Checks contact ownership
    """
    try:
        await StudentService.delete_emergency_contact(
            student_id=current_user["id"], contact_id=contact_id, prisma=prisma
        )
        return {"message": "Emergency contact deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Help Request Route
@router.post("/help-request")
async def submit_help_request(
    help_request: HelpRequestSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Submit a help request

    Requires authentication
    Validates help request data
    """
    try:
        result = await StudentService.submit_help_request(
            student_id=current_user["id"], help_request_data=help_request, prisma=prisma
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Feedback Route
@router.post("/feedback", response_model=dict)
async def submit_feedback(
    feedback: FeedbackCreateSchema,
    current_user: dict = Depends(get_current_user),
    prisma: Prisma = Depends(get_prisma),
):
    """
    Submit feedback

    Requires authentication
    Validates feedback data
    """
    try:
        result = await StudentService.submit_feedback(
            student_id=current_user["id"], feedback_data=feedback, prisma=prisma
        )
        return {"message": "Feedback submitted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Additional Routes
@router.get("/emergency-contacts", response_model=List[EmergencyContactUpdateSchema])
async def get_emergency_contacts(
    current_user: dict = Depends(get_current_user), prisma: Prisma = Depends(get_prisma)
):
    """
    Retrieve emergency contacts

    Requires authentication
    Returns a list of emergency contacts for the student
    """
    try:
        contacts = await StudentService.get_emergency_contacts(
            student_id=current_user["id"], prisma=prisma
        )
        return contacts
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/feedback", response_model=List[dict])
async def get_feedback(
    current_user: dict = Depends(get_current_user), prisma: Prisma = Depends(get_prisma)
):
    """
    Retrieve feedback submitted by the student

    Requires authentication
    Returns a list of feedback entries
    """
    try:
        feedback_entries = await StudentService.get_feedback(
            student_id=current_user["id"], prisma=prisma
        )
        return feedback_entries
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
