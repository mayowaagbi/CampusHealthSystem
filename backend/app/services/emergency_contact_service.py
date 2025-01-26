# app/services/emergency_contact_service.py
from typing import List, Dict
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.student_schemas import (
    EmergencyContactCreateSchema,
    EmergencyContactUpdateSchema,
    EmergencyContactSchema,
)


class EmergencyContactService:
    @staticmethod
    async def create_emergency_contact(
        prisma: Prisma, student_id: int, contact_data: EmergencyContactCreateSchema
    ) -> EmergencyContactSchema:
        """
        Create an emergency contact

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            contact_data (EmergencyContactCreateSchema): Emergency contact details

        Returns:
            EmergencyContactSchema: Created emergency contact
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create emergency contact
            contact = await prisma.emergencycontact.create(
                data={
                    "student_id": student_id,
                    "name": contact_data.name,
                    "relationship": contact_data.relationship,
                    "phone": contact_data.phone,
                }
            )
            return EmergencyContactSchema.from_orm(contact)

        except Exception as e:
            raise ValueError(f"Error creating emergency contact: {str(e)}")

    @staticmethod
    async def update_emergency_contact(
        prisma: Prisma,
        student_id: int,
        contact_id: int,
        contact_update: EmergencyContactUpdateSchema,
    ) -> EmergencyContactSchema:
        """
        Update an emergency contact

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            contact_id (int): ID of the emergency contact
            contact_update (EmergencyContactUpdateSchema): Updated contact details

        Returns:
            EmergencyContactSchema: Updated emergency contact
        """
        try:
            contact = await prisma.emergencycontact.find_unique(
                where={"id": contact_id, "student_id": student_id}
            )
            if not contact:
                raise ValueError("Emergency contact not found")

            # Update contact fields
            updated_contact = await prisma.emergencycontact.update(
                where={"id": contact_id}, data=contact_update.dict(exclude_unset=True)
            )

            return EmergencyContactSchema.from_orm(updated_contact)

        except Exception as e:
            raise ValueError(f"Error updating emergency contact: {str(e)}")

    @staticmethod
    async def delete_emergency_contact(
        prisma: Prisma, student_id: int, contact_id: int
    ) -> Dict[str, str]:
        """
        Delete an emergency contact

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            contact_id (int): ID of the emergency contact to delete

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            contact = await prisma.emergencycontact.find_unique(
                where={"id": contact_id, "student_id": student_id}
            )
            if not contact:
                raise ValueError("Emergency contact not found")

            await prisma.emergencycontact.delete(where={"id": contact_id})

            return {"message": "Emergency contact deleted successfully"}

        except RecordNotFoundError:
            raise ValueError("Emergency contact not found")
        except Exception as e:
            raise ValueError(f"Error deleting emergency contact: {str(e)}")

    @staticmethod
    async def get_student_emergency_contacts(
        prisma: Prisma, student_id: int
    ) -> List[EmergencyContactSchema]:
        """
        Retrieve all emergency contacts for a student

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[EmergencyContactSchema]: List of emergency contacts for the student
        """
        try:
            contacts = await prisma.emergencycontact.find_many(
                where={"student_id": student_id},
                order_by={"created_at": "desc"},  # Order by creation date
            )
            return [EmergencyContactSchema.from_orm(contact) for contact in contacts]

        except Exception as e:
            raise ValueError(f"Error retrieving emergency contacts: {str(e)}")
