# app/services/help_request_service.py
from typing import Dict, List
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.student_schemas import HelpRequestSchema


class HelpRequestService:
    @staticmethod
    async def request_help(
        prisma: Prisma, student_id: int, help_request_data: HelpRequestSchema
    ) -> Dict[str, str]:
        """
        Request emergency help

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            help_request_data (HelpRequestSchema): Help request details

        Returns:
            Dict with help request result
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create help request
            help_request = await prisma.helprequest.create(
                data={
                    "student_id": student_id,
                    "description": help_request_data.description,
                    "urgency_level": help_request_data.urgency_level,
                }
            )
            return {
                "message": "Help request submitted successfully",
                "request_id": help_request.id,
            }
        except Exception as e:
            raise ValueError(f"Error requesting help: {str(e)}")

    @staticmethod
    async def get_help_request_by_id(
        prisma: Prisma, request_id: int
    ) -> HelpRequestSchema:
        """
        Retrieve a help request by its ID

        Args:
            prisma (Prisma): Prisma client
            request_id (int): ID of the help request

        Returns:
            HelpRequestSchema: Help request details
        """
        try:
            help_request = await prisma.helprequest.find_unique(
                where={"id": request_id}
            )
            if not help_request:
                raise ValueError("Help request not found")

            return HelpRequestSchema.from_orm(help_request)

        except Exception as e:
            raise ValueError(f"Error retrieving help request: {str(e)}")

    @staticmethod
    async def get_student_help_requests(
        prisma: Prisma, student_id: int
    ) -> List[HelpRequestSchema]:
        """
        Retrieve all help requests for a student

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[HelpRequestSchema]: List of help requests for the student
        """
        try:
            help_requests = await prisma.helprequest.find_many(
                where={"student_id": student_id},
                order_by={"created_at": "desc"},  # Order by creation date
            )
            return [HelpRequestSchema.from_orm(request) for request in help_requests]

        except Exception as e:
            raise ValueError(f"Error retrieving help requests: {str(e)}")
