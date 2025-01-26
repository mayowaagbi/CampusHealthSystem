# app/services/student_service.py
from typing import Dict, Optional, List, Any
from prisma import Prisma
from prisma.errors import RecordNotFoundError, UniqueViolationError

from app.schemas.student_schemas import (
    StudentProfileUpdateSchema,
    StudentProfileSchema,
    StudentHealthInfoSchema,
    EmergencyContactSchema,
)
from app.services.activity_log_service import ActivityLogService
from app.services.notification_service import NotificationService


class StudentService:
    @staticmethod
    async def get_student_profile(
        prisma: Prisma, student_id: int
    ) -> StudentProfileSchema:
        """
        Retrieve comprehensive student profile

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            StudentProfileSchema: Detailed student profile
        """
        try:
            # Fetch student profile with comprehensive related data
            student = await prisma.student.find_unique(
                where={"id": student_id},
                include={
                    "user": True,
                    "profile": True,
                    "health_info": True,
                    "emergency_contacts": True,
                },
            )

            if not student:
                raise ValueError("Student not found")

            return StudentProfileSchema(
                id=student.id,
                name=student.user.name,
                email=student.user.email,
                department=student.profile.department if student.profile else None,
                year_of_study=(
                    student.profile.year_of_study if student.profile else None
                ),
                health_info=(
                    StudentHealthInfoSchema.from_orm(student.health_info)
                    if student.health_info
                    else None
                ),
                emergency_contacts=[
                    EmergencyContactSchema.from_orm(contact)
                    for contact in student.emergency_contacts
                ],
            )
        except Exception as e:
            raise ValueError(f"Error retrieving student profile: {str(e)}")

    @staticmethod
    async def update_student_profile(
        prisma: Prisma, student_id: int, profile_update: StudentProfileUpdateSchema
    ) -> StudentProfileSchema:
        """
        Update student profile with comprehensive validation

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            profile_update (StudentProfileUpdateSchema): Profile update data

        Returns:
            StudentProfileSchema: Updated student profile
        """
        try:
            # Start a transaction for atomic updates
            async with prisma.tx() as transaction:
                # Validate student exists
                student = await transaction.student.find_unique(
                    where={"id": student_id}, include={"user": True}
                )
                if not student:
                    raise ValueError("Student not found")

                # Prepare update data (exclude unset fields)
                update_data = profile_update.dict(exclude_unset=True)

                # Separate updates for different models
                user_update = {}
                profile_model_update = {}
                health_info_update = {}

                # Categorize updates
                for key, value in update_data.items():
                    if key in ["name", "email"]:
                        user_update[key] = value
                    elif key in ["department", "year_of_study"]:
                        profile_model_update[key] = value
                    elif key in ["medical_history", "allergies", "chronic_conditions"]:
                        health_info_update[key] = value

                # Perform updates
                if user_update:
                    await transaction.user.update(
                        where={"id": student.user_id}, data=user_update
                    )

                # Update student profile
                if profile_model_update:
                    await transaction.studentprofile.upsert(
                        where={"student_id": student_id},
                        data={
                            "create": {
                                "student_id": student_id,
                                **profile_model_update,
                            },
                            "update": profile_model_update,
                        },
                    )

                # Update health info
                if health_info_update:
                    await transaction.healthinfo.upsert(
                        where={"student_id": student_id},
                        data={
                            "create": {"student_id": student_id, **health_info_update},
                            "update": health_info_update,
                        },
                    )

                # Log activity
                await ActivityLogService.log_activity(
                    prisma, user_id=student_id, action="STUDENT_PROFILE_UPDATED"
                )

                # Send notification
                await NotificationService.create_notification(
                    prisma,
                    user_id=student_id,
                    title="Profile Updated",
                    message="Your student profile has been successfully updated.",
                    type="SYSTEM",
                )

                # Retrieve and return updated profile
                updated_student = await transaction.student.find_unique(
                    where={"id": student_id},
                    include={
                        "user": True,
                        "profile": True,
                        "health_info": True,
                        "emergency_contacts": True,
                    },
                )

                return StudentProfileSchema(
                    id=updated_student.id,
                    name=updated_student.user.name,
                    email=updated_student.user.email,
                    department=(
                        updated_student.profile.department
                        if updated_student.profile
                        else None
                    ),
                    year_of_study=(
                        updated_student.profile.year_of_study
                        if updated_student.profile
                        else None
                    ),
                    health_info=(
                        StudentHealthInfoSchema.from_orm(updated_student.health_info)
                        if updated_student.health_info
                        else None
                    ),
                    emergency_contacts=[
                        EmergencyContactSchema.from_orm(contact)
                        for contact in updated_student.emergency_contacts
                    ],
                )

        except UniqueViolationError:
            raise ValueError("Update would violate unique constraint")
        except Exception as e:
            raise ValueError(f"Error updating student profile: {str(e)}")

    @staticmethod
    async def create_emergency_contact(
        prisma: Prisma, student_id: int, contact_data: Dict[str, Any]
    ) -> EmergencyContactSchema:
        """
        Create an emergency contact for a student

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            contact_data (Dict[str, Any]): Emergency contact details

        Returns:
            EmergencyContactSchema: Created emergency contact
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create emergency contact
            emergency_contact = await prisma.emergencycontact.create(
                data={"student_id": student_id, **contact_data}
            )

            # Log activity
            await ActivityLogService.log_activity(
                prisma, user_id=student_id, action="EMERGENCY_CONTACT_CREATED"
            )

            return EmergencyContactSchema.from_orm(emergency_contact)

        except Exception as e:
            raise ValueError(f"Error creating emergency contact: {str(e)}")
