# app/services/journal_service.py
from typing import List, Dict
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.student_schemas import JournalCreateSchema, JournalSchema


class JournalService:
    @staticmethod
    async def create_journal(
        prisma: Prisma, student_id: int, journal_data: JournalCreateSchema
    ) -> JournalSchema:
        """
        Create a journal entry

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            journal_data (JournalCreateSchema): Journal entry details

        Returns:
            JournalSchema: Created journal entry
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create journal entry
            journal_entry = await prisma.journal.create(
                data={
                    "student_id": student_id,
                    "content": journal_data.content,
                    "date": journal_data.date,
                }
            )
            return JournalSchema.from_orm(journal_entry)

        except Exception as e:
            raise ValueError(f"Error creating journal entry: {str(e)}")

    @staticmethod
    async def delete_journal(
        prisma: Prisma, student_id: int, journal_id: int
    ) -> Dict[str, str]:
        """
        Delete a journal entry

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            journal_id (int): ID of the journal entry to delete

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            # Validate journal entry exists
            journal_entry = await prisma.journal.find_unique(
                where={"id": journal_id, "student_id": student_id}
            )
            if not journal_entry:
                raise ValueError("Journal entry not found")

            # Delete journal entry
            await prisma.journal.delete(where={"id": journal_id})

            return {"message": "Journal entry deleted successfully"}

        except RecordNotFoundError:
            raise ValueError("Journal entry not found")
        except Exception as e:
            raise ValueError(f"Error deleting journal entry: {str(e)}")

    @staticmethod
    async def get_student_journals(
        prisma: Prisma, student_id: int
    ) -> List[JournalSchema]:
        """
        Retrieve student's journal entries

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student

        Returns:
            List[JournalSchema]: List of journal entries for the student
        """
        try:
            journals = await prisma.journal.find_many(
                where={"student_id": student_id},
                order_by={"date": "desc"},  # Order by date
            )
            return [JournalSchema.from_orm(journal) for journal in journals]

        except Exception as e:
            raise ValueError(f"Error retrieving journal entries: {str(e)}")
