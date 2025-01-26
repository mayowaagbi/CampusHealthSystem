# app/routes/admin_routes.py
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List

from app.controllers.admin_controller import AdminController
from app.schemas import (
    UserCreate,
    UserUpdate,
    HealthAlertCreate,
    SystemSettingUpdate,
)
from app.middleware.auth import admin_required

router = APIRouter(prefix="/admin", tags=["Admin"])


# User Management Routes
@router.get("/users", response_model=List[UserCreate])
async def list_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    current_user=Depends(admin_required),
):
    """Retrieve list of users with pagination"""
    try:
        return await AdminController.list_users(skip, limit)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/users", response_model=UserCreate)
async def create_user(user: UserCreate, current_user=Depends(admin_required)):
    """Create a new user"""
    try:
        return await AdminController.create_user(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/users/{user_id}", response_model=UserCreate)
async def update_user(
    user_id: str, user_update: UserUpdate, current_user=Depends(admin_required)
):
    """Update user details"""
    try:
        return await AdminController.update_user(user_id, user_update)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/users/{user_id}")
async def delete_user(user_id: str, current_user=Depends(admin_required)):
    """Delete a user"""
    try:
        return await AdminController.delete_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Health Alerts Routes
@router.get("/health-alerts", response_model=List[HealthAlertCreate])
async def list_health_alerts(current_user=Depends(admin_required)):
    """Retrieve all health alerts"""
    try:
        return await AdminController.list_health_alerts()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/health-alerts", response_model=HealthAlertCreate)
async def create_health_alert(
    alert: HealthAlertCreate, current_user=Depends(admin_required)
):
    """Create a new health alert"""
    try:
        return await AdminController.create_health_alert(alert)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/health-alerts/{alert_id}")
async def delete_health_alert(alert_id: str, current_user=Depends(admin_required)):
    """Delete a health alert"""
    try:
        return await AdminController.delete_health_alert(alert_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# Reporting Routes
@router.get("/reports")
async def generate_reports(
    report_type: str = Query("summary"), current_user=Depends(admin_required)
):
    """Generate system reports"""
    try:
        return await AdminController.generate_reports(report_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# System Settings Routes
@router.get("/system-settings")
async def get_system_settings(current_user=Depends(admin_required)):
    """Retrieve system settings"""
    try:
        return await AdminController.get_system_settings()
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/system-settings")
async def update_system_setting(
    setting: SystemSettingUpdate, current_user=Depends(admin_required)
):
    """Update a specific system setting"""
    try:
        return await AdminController.update_system_setting(setting)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
