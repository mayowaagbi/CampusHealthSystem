# app/services/student_profile_service.py
from typing import Dict, Optional, Any
from prisma import Prisma
from prisma.errors import UniqueViolationError, RecordNotFoundError

from app.schemas.student_schemas import (
    StudentProfileSchema,
    StudentProfileUpdateSchema,
    EmergencyContactSchema,
    StudentHealthInfoSchema,
)
from app.services.activity_log_service import ActivityLogService
from app.services.notification_service import NotificationService


class StudentProfileService:
    @staticmethod
    async def get_profile(prisma: Prisma, student_id: int) -> StudentProfileSchema:
        """
        Retrieve a student's profile

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            StudentProfileSchema: Student profile details
        """
        try:
            # Retrieve student profile with related data
            student_profile = await prisma.studentprofile.find_unique(
                where={"student_id": student_id},
                include={"student": {"include": {"user": True}}},
            )

            if not student_profile:
                raise ValueError("Student profile not found")

            return StudentProfileSchema(
                id=student_profile.id,
                student_id=student_profile.student_id,
                department=student_profile.department,
                year_of_study=student_profile.year_of_study,
                personal_info=student_profile.personal_info,
                medical_history=student_profile.medical_history,
                health_info=(
                    StudentHealthInfoSchema.from_orm(student_profile.health_info)
                    if student_profile.health_info
                    else None
                ),
                emergency_contacts=(
                    [
                        EmergencyContactSchema.from_orm(contact)
                        for contact in student_profile.emergency_contacts
                    ]
                    if student_profile.emergency_contacts
                    else []
                ),
            )

        except Exception as e:
            raise ValueError(f"Error retrieving student profile: {str(e)}")

    @staticmethod
    async def update_profile(
        prisma: Prisma, student_id: int, profile_update: StudentProfileUpdateSchema
    ) -> StudentProfileSchema:
        """
        Update a student's profile

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            profile_update (StudentProfileUpdateSchema): Profile update data

        Returns:
            StudentProfileSchema: Updated student profile
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Prepare update data (exclude unset fields)
            update_data = profile_update.dict(exclude_unset=True)

            # Update student profile
            updated_profile = await prisma.studentprofile.update(
                where={"student_id": student_id}, data=update_data
            )

            # Log profile update activity
            await ActivityLogService.log_activity(
                prisma, user_id=student_id, action="STUDENT_PROFILE_UPDATED"
            )

            # Send profile update notification
            await NotificationService.create_notification(
                prisma,
                user_id=student_id,
                title="Profile Updated",
                message="Your student profile has been successfully updated.",
                type="SYSTEM",
            )

            return StudentProfileSchema(
                id=updated_profile.id,
                student_id=updated_profile.student_id,
                department=updated_profile.department,
                year_of_study=updated_profile.year_of_study,
                personal_info=updated_profile.personal_info,
                medical_history=updated_profile.medical_history,
            )

        except UniqueViolationError:
            raise ValueError("A profile for this student already exists")
        except Exception as e:
            raise ValueError(f"Error updating student profile: {str(e)}")

    @staticmethod
    async def create_profile(
        prisma: Prisma, student_id: int, profile_data: StudentProfileUpdateSchema
    ) -> StudentProfileSchema:
        """
        Create a new student profile

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            profile_data (StudentProfileUpdateSchema): Initial profile data

        Returns:
            StudentProfileSchema: Created student profile
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Check if profile already exists
            existing_profile = await prisma.studentprofile.find_unique(
                where={"student_id": student_id}
            )
            if existing_profile:
                raise ValueError("Student profile already exists")

            # Create new student profile
            new_profile = await prisma.studentprofile.create(
                data={"student_id": student_id, **profile_data.dict()}
            )

            # Log profile creation activity
            await ActivityLogService.log_activity(
                prisma, user_id=student_id, action="STUDENT_PROFILE_CREATED"
            )

            # Send profile creation notification
            await NotificationService.create_notification(
                prisma,
                user_id=student_id,
                title="Profile Created",
                message="Your student profile has been successfully created.",
                type="SYSTEM",
            )

            return StudentProfileSchema(
                id=new_profile.id,
                student_id=new_profile.student_id,
                department=new_profile.department,
                year_of_study=new_profile.year_of_study,
                personal_info=new_profile.personal_info,
                medical_history=new_profile.medical_history,
            )

        except UniqueViolationError:
            raise ValueError("A profile for this student already exists")
        except Exception as e:
            raise ValueError(f"Error creating student profile: {str(e)}")

    @staticmethod
    async def get_basic_profile_info(
        prisma: Prisma, student_id: int
    ) -> Dict[str, Optional[str]]:
        """
        Retrieve basic profile information

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            Dict with basic profile information
        """
        try:
            # Retrieve student with associated user
            student = await prisma.student.find_unique(
                where={"id": student_id}, include={"user": True}
            )

            if not student:
                raise ValueError("Student not found")

            return {
                "name": student.user.name,
                "email": student.user.email,
                "department": student.profile.department if student.profile else None,
                "year_of_study": (
                    student.profile.year_of_study if student.profile else None
                ),
            }

        except RecordNotFoundError:
            raise ValueError("Student not found")
        except Exception as e:
            raise ValueError(f"Error retrieving basic profile: {str(e)}")

    @staticmethod
    async def check_profile_completeness(
        prisma: Prisma, student_id: int
    ) -> Dict[str, Any]:
        """
        Check the completeness of a student's profile

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            Dict with profile completeness status
        """
        try:
            # Retrieve student profile
            student_profile = await prisma.studentprofile.find_unique(
                where={"student_id": student_id}
            )

            if not student_profile:
                return {"profile_exists": False, "is_complete": False}

            # Define completeness criteria
            completeness_checks = {
                "personal_info": bool(student_profile.personal_info),
                "medical_history": bool(student_profile.medical_history),
                "emergency_contact": bool(student_profile.emergency_contact),
            }

            return {
                "profile_exists": True,
                "is_complete": all(completeness_checks.values()),
                "completeness_details": completeness_checks,
            }

        except Exception as e:
            raise ValueError(f"Error checking profile completeness: {str(e)}")
