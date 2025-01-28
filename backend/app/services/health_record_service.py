# app/services/health_record_service.py
from typing import List
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.health_alert_schemas import HealthRecordSchema


class HealthRecordService:
    @staticmethod
    async def get_student_health_records(
        prisma: Prisma, student_id: int, skip: int = 0, limit: int = 10
    ) -> List[HealthRecordSchema]:
        """
        Retrieve student's health records

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            skip (int): Number of records to skip
            limit (int): Maximum number of records to return

        Returns:
            List[HealthRecordSchema]: List of health records for the student
        """
        try:
            health_records = await prisma.healthrecord.find_many(
                where={"student_id": student_id},
                skip=skip,
                take=limit,
                order_by={"date": "desc"},  # Order by date
            )

            return [HealthRecordSchema.from_orm(record) for record in health_records]
        except RecordNotFoundError:
            raise ValueError("No health records found for this student")
        except Exception as e:
            raise ValueError(f"Error retrieving health records: {str(e)}")

    @staticmethod
    async def create_health_record(
        prisma: Prisma, student_id: int, record_data: HealthRecordSchema
    ) -> HealthRecordSchema:
        """
        Create a new health record

        Args:
            prisma (Prisma): Prisma client
            student_id (int): ID of the student
            record_data (HealthRecordSchema): Health record details

        Returns:
            HealthRecordSchema: Created health record
        """
        try:
            # Validate student exists
            student = await prisma.student.find_unique(where={"id": student_id})
            if not student:
                raise ValueError("Student not found")

            # Create health record
            new_record = await prisma.healthrecord.create(
                data={
                    "student_id": student_id,
                    "provider_id": record_data.provider_id,
                    "diagnosis": record_data.diagnosis,
                    "prescription": record_data.prescription,
                    "date": record_data.date,
                }
            )

            return HealthRecordSchema.from_orm(new_record)

        except Exception as e:
            raise ValueError(f"Error creating health record: {str(e)}")
