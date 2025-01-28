# app/routes/__init__.py
from .user_routes import router as user_router
from .admin_routes import router as admin_router
from .student_routes import router as student_router
from .provider_routes import router as provider_router
from .auth_routes import router as auth_router
from .healthcare_provider_routes import (
    router as healthcare_router,
)  # Ensure this line is present

__all__ = [
    "user_router",
    "admin_router",
    "student_router",
    "provider_router",
    "auth_router",
    "healthcare_router",  # Add the healthcare router to the list
]
