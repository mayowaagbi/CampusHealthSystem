# app/services/mood_tracker_service.py
from typing import List
from prisma import Prisma
from prisma.errors import RecordNotFoundError
from app.schemas.student_schemas import MoodLogSchema, MoodLogResponseSchema
from datetime import datetime


class MoodTrackerService:
    @staticmethod
    async def log_mood(
        prisma: Prisma, student_id: int, mood_data: MoodLogSchema
    ) -> MoodLogResponseSchema:
        """
        Log student's mood

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            mood_data (MoodLogSchema): Mood log details

        Returns:
            MoodLogResponseSchema: Logged mood entry
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create mood log entry
            mood_log = await prisma.moodtracker.create(
                data={
                    "student_id": student_id,
                    "mood": mood_data.mood,
                    "notes": mood_data.notes,
                    "timestamp": datetime.utcnow(),
                }
            )

            return MoodLogResponseSchema(
                id=mood_log.id,
                student_id=mood_log.student_id,
                mood=mood_data.mood,
                notes=mood_data.notes,
                timestamp=mood_log.timestamp,
            )
        except Exception as e:
            raise ValueError(f"Error logging mood: {str(e)}")

    @staticmethod
    async def get_student_moods(
        prisma: Prisma, student_id: int
    ) -> List[MoodLogResponseSchema]:
        """
        Retrieve student's mood logs

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[MoodLogResponseSchema]: List of mood logs for the student
        """
        try:
            # Retrieve mood logs for the student
            mood_logs = await prisma.moodtracker.find_many(
                where={"student_id": student_id},
                order_by={"timestamp": "desc"},  # Order by timestamp
            )

            return [
                MoodLogResponseSchema(
                    id=log.id,
                    student_id=log.student_id,
                    mood=log.mood,
                    notes=log.notes,
                    timestamp=log.timestamp,
                )
                for log in mood_logs
            ]
        except RecordNotFoundError:
            raise ValueError("No mood logs found for this student")
        except Exception as e:
            raise ValueError(f"Error retrieving mood logs: {str(e)}")
