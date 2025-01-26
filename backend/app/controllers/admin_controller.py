# app/controllers/admin_controller.py
from typing import List, Dict
from app.services.user_service import UserService
from app.services.health_alert_service import HealthAlertService
from app.services.report_service import ReportService
from app.services.system_setting_service import SystemSettingService
from app.schemas import (
    UserCreate,
    UserUpdate,
    HealthAlertCreate,
    SystemSettingUpdate,
)


class AdminController:
    @staticmethod
    async def list_users(skip: int = 0, limit: int = 100) -> List[UserCreate]:
        """Retrieve a list of users with pagination"""
        try:
            return await UserService.list_users(skip, limit)
        except Exception as e:
            raise ValueError(f"Error retrieving users: {str(e)}")

    @staticmethod
    async def create_user(user: UserCreate) -> UserCreate:
        """Create a new user"""
        try:
            return await UserService.create_user(user)
        except Exception as e:
            raise ValueError(f"Error creating user: {str(e)}")

    @staticmethod
    async def update_user(user_id: str, user_update: UserUpdate) -> UserCreate:
        """Update user details"""
        try:
            return await UserService.update_user(user_id, user_update)
        except Exception as e:
            raise ValueError(f"Error updating user: {str(e)}")

    @staticmethod
    async def delete_user(user_id: str) -> Dict[str, str]:
        """Delete a user"""
        try:
            await UserService.delete_user(user_id)
            return {"message": "User  deleted successfully"}
        except Exception as e:
            raise ValueError(f"Error deleting user: {str(e)}")

    @staticmethod
    async def list_health_alerts() -> List[HealthAlertCreate]:
        """Retrieve all health alerts"""
        try:
            return await HealthAlertService.get_all_health_alerts()
        except Exception as e:
            raise ValueError(f"Error retrieving health alerts: {str(e)}")

    @staticmethod
    async def create_health_alert(alert: HealthAlertCreate) -> HealthAlertCreate:
        """Create a new health alert"""
        try:
            return await HealthAlertService.create_health_alert(alert)
        except Exception as e:
            raise ValueError(f"Error creating health alert: {str(e)}")

    @staticmethod
    async def delete_health_alert(alert_id: str) -> Dict[str, str]:
        """Delete a health alert"""
        try:
            await HealthAlertService.delete_health_alert(alert_id)
            return {"message": "Health alert deleted successfully"}
        except Exception as e:
            raise ValueError(f"Error deleting health alert: {str(e)}")

    @staticmethod
    async def generate_reports(report_type: str) -> Dict:
        """Generate system reports"""
        try:
            return await ReportService.generate_report(report_type)
        except Exception as e:
            raise ValueError(f"Error generating report: {str(e)}")

    @staticmethod
    async def get_system_settings() -> Dict:
        """Retrieve system settings"""
        try:
            return await SystemSettingService.get_system_settings()
        except Exception as e:
            raise ValueError(f"Error retrieving system settings: {str(e)}")

    @staticmethod
    async def update_system_setting(setting: SystemSettingUpdate) -> Dict:
        """Update a specific system setting"""
        try:
            await SystemSettingService.update_system_setting(setting)
            return {"message": "System setting updated successfully"}
        except Exception as e:
            raise ValueError(f"Error updating system setting: {str(e)}")
