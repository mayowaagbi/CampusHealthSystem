# app/routes/notification_routes.py
from fastapi import APIRouter, Depends, HTTPException
from app.controllers.notification_controller import NotificationController
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/")
async def get_notifications(
    current_user=Depends(get_current_user), skip: int = 0, limit: int = 10
):
    """Retrieve user notifications"""
    try:
        return await NotificationController.get_notifications(
            current_user.id, skip, limit
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/mark-read/{notification_id}")
async def mark_notification_read(
    notification_id: int, current_user=Depends(get_current_user)
):
    """Mark a notification as read"""
    try:
        return await NotificationController.mark_notification_as_read(
            current_user.id, notification_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
