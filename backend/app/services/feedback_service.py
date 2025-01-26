# app/services/feedback_service.py
from typing import Dict, List
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.student_schemas import FeedbackCreateSchema, FeedbackSchema


class FeedbackService:
    @staticmethod
    async def submit_feedback(
        prisma: Prisma, student_id: int, feedback_data: FeedbackCreateSchema
    ) -> Dict[str, str]:
        """
        Submit feedback

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            feedback_data (FeedbackCreateSchema): Feedback details

        Returns:
            Dict with feedback submission result
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create feedback entry
            feedback = await prisma.feedback.create(
                data={
                    "student_id": student_id,
                    "content": feedback_data.content,
                    "rating": feedback_data.rating,
                }
            )
            return {
                "message": "Feedback submitted successfully",
                "feedback_id": feedback.id,
            }
        except Exception as e:
            raise ValueError(f"Error submitting feedback: {str(e)}")

    @staticmethod
    async def get_feedback_by_id(prisma: Prisma, feedback_id: int) -> FeedbackSchema:
        """
        Retrieve feedback by its ID

        Args:
            prisma (Prisma): Prisma client
            feedback_id (int): ID of the feedback

        Returns:
            FeedbackSchema: Feedback details
        """
        try:
            feedback = await prisma.feedback.find_unique(where={"id": feedback_id})
            if not feedback:
                raise ValueError("Feedback not found")

            return FeedbackSchema.from_orm(feedback)

        except Exception as e:
            raise ValueError(f"Error retrieving feedback: {str(e)}")

    @staticmethod
    async def get_student_feedbacks(
        prisma: Prisma, student_id: int
    ) -> List[FeedbackSchema]:
        """
        Retrieve all feedback submitted by a student

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[FeedbackSchema]: List of feedback entries for the student
        """
        try:
            feedbacks = await prisma.feedback.find_many(
                where={"student_id": student_id},
                order_by={"created_at": "desc"},  # Order by creation date
            )
            return [FeedbackSchema.from_orm(feedback) for feedback in feedbacks]

        except Exception as e:
            raise ValueError(f"Error retrieving feedbacks: {str(e)}")
