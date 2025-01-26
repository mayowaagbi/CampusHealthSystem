# app/services/prescription_service.py
from typing import Dict, Any, Optional, List
from prisma import Prisma
from prisma.errors import RecordNotFoundError, UniqueViolationError

from app.schemas.prescription_schemas import (
    PrescriptionCreateSchema,
    PrescriptionSchema,
)
from app.services.activity_log_service import ActivityLogService
from app.services.notification_service import NotificationService


class PrescriptionService:
    @staticmethod
    async def create_prescription(
        prisma: Prisma, provider_id: int, prescription_data: PrescriptionCreateSchema
    ) -> PrescriptionSchema:
        """
        Create a new prescription

        Args:
            prisma (Prisma): Prisma client
            provider_id (int): ID of the healthcare provider
            prescription_data (PrescriptionCreateSchema): Prescription details

        Returns:
            PrescriptionSchema: Created prescription details
        """
        try:
            # Validate provider exists
            provider = await prisma.provider.find_unique(where={"id": provider_id})
            if not provider:
                raise ValueError("Provider not found")

            # Validate student exists
            student = await prisma.student.find_unique(
                where={"id": prescription_data.student_id}
            )
            if not student:
                raise ValueError("Student not found")

            # Create prescription
            new_prescription = await prisma.prescription.create(
                data={
                    "provider_id": provider_id,
                    "student_id": prescription_data.student_id,
                    "medication": prescription_data.medication,
                    "dosage": prescription_data.dosage,
                    "frequency": prescription_data.frequency,
                    "start_date": prescription_data.start_date,
                    "end_date": prescription_data.end_date,
                    "instructions": prescription_data.instructions,
                }
            )

            # Log prescription creation activity
            await ActivityLogService.log_activity(
                prisma, user_id=provider_id, action="PRESCRIPTION_CREATED"
            )

            # Send notification to student
            await NotificationService.create_notification(
                prisma,
                user_id=student.user_id,
                title="New Prescription",
                message=f"A new prescription has been issued for {prescription_data.medication}",
                type="MEDICAL",
            )

            return PrescriptionSchema(
                id=new_prescription.id,
                provider_id=new_prescription.provider_id,
                student_id=new_prescription.student_id,
                medication=new_prescription.medication,
                dosage=new_prescription.dosage,
                frequency=new_prescription.frequency,
                start_date=new_prescription.start_date,
                end_date=new_prescription.end_date,
                instructions=new_prescription.instructions,
            )

        except UniqueViolationError:
            raise ValueError("Error creating prescription: Unique constraint violation")
        except Exception as e:
            raise ValueError(f"Error creating prescription: {str(e)}")

    @staticmethod
    async def get_prescription_by_id(
        prisma: Prisma, prescription_id: int
    ) -> Optional[PrescriptionSchema]:
        """
        Retrieve a prescription by its ID

        Args:
            prisma (Prisma): Prisma client
            prescription_id (int): ID of the prescription

        Returns:
            Optional[PrescriptionSchema]: Prescription details or None
        """
        try:
            prescription = await prisma.prescription.find_unique(
                where={"id": prescription_id}
            )

            if not prescription:
                return None

            return PrescriptionSchema(
                id=prescription.id,
                provider_id=prescription.provider_id,
                student_id=prescription.student_id,
                medication=prescription.medication,
                dosage=prescription.dosage,
                frequency=prescription.frequency,
                start_date=prescription.start_date,
                end_date=prescription.end_date,
                instructions=prescription.instructions,
            )

        except Exception as e:
            raise ValueError(f"Error retrieving prescription: {str(e)}")

    @staticmethod
    async def get_student_prescriptions(
        prisma: Prisma, student_id: int
    ) -> List[PrescriptionSchema]:
        """
        Retrieve all prescriptions for a student

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[PrescriptionSchema]: List of student's prescriptions
        """
        try:
            prescriptions = await prisma.prescription.find_many(
                where={"student_id": student_id}, order_by={"created_at": "desc"}
            )

            return [
                PrescriptionSchema(
                    id=prescription.id,
                    provider_id=prescription.provider_id,
                    student_id=prescription.student_id,
                    medication=prescription.medication,
                    dosage=prescription.dosage,
                    frequency=prescription.frequency,
                    start_date=prescription.start_date,
                    end_date=prescription.end_date,
                    instructions=prescription.instructions,
                )
                for prescription in prescriptions
            ]

        except Exception as e:
            raise ValueError(f"Error retrieving student prescriptions: {str(e)}")

    @staticmethod
    async def update_prescription(
        prisma: Prisma, prescription_id: int, update_data: Dict[str, Any]
    ) -> PrescriptionSchema:
        """
        Update an existing prescription

        Args:
            prisma (Prisma): Prisma client
            prescription_id (int): ID of the prescription to update
            update_data (Dict[str, Any]): Updated prescription details

        Returns:
            PrescriptionSchema: Updated prescription details
        """
        try:
            # Validate prescription exists
            existing_prescription = await prisma.prescription.find_unique(
                where={"id": prescription_id}
            )
            if not existing_prescription:
                raise ValueError("Prescription not found")

            # Update prescription
            updated_prescription = await prisma.prescription.update(
                where={"id": prescription_id}, data=update_data
            )

            # Log prescription update activity
            await ActivityLogService.log_activity(
                prisma,
                user_id=updated_prescription.provider_id,
                action="PRESCRIPTION_UPDATED",
            )

            return PrescriptionSchema(
                id=updated_prescription.id,
                provider_id=updated_prescription.provider_id,
                student_id=updated_prescription.student_id,
                medication=updated_prescription.medication,
                dosage=updated_prescription.dosage,
                frequency=updated_prescription.frequency,
                start_date=updated_prescription.start_date,
                end_date=updated_prescription.end_date,
                instructions=updated_prescription.instructions,
            )

        except Exception as e:
            raise ValueError(f"Error updating prescription: {str(e)}")

    @staticmethod
    async def delete_prescription(
        prisma: Prisma, prescription_id: int
    ) -> Dict[str, str]:
        """
        Delete a prescription

        Args:
            prisma (Prisma): Prisma client
            prescription_id (int): ID of the prescription to delete

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            # Validate prescription exists
            existing_prescription = await prisma.prescription.find_unique(
                where={"id": prescription_id}
            )
            if not existing_prescription:
                raise ValueError("Prescription not found")

            # Delete prescription
            await prisma.prescription.delete(where={"id": prescription_id})

            # Log prescription deletion activity
            await ActivityLogService.log_activity(
                prisma,
                user_id=existing_prescription.provider_id,
                action="PRESCRIPTION_DELETED",
            )

            return {"message": "Prescription deleted successfully"}

        except Exception as e:
            raise ValueError(f"Error deleting prescription: {str(e)}")
