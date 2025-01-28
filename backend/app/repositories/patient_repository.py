# from prisma import Prisma
# from app.models import Patient  # Assuming you have a Patient model
# from app.schemas.provider_schemas import UpdatePatientSchema


# class PatientRepository:
#     def __init__(self, prisma: Prisma):
#         self.prisma = prisma

#     async def get_patient_by_id(self, patient_id: int) -> Patient:
#         """Retrieve a patient by ID."""
#         return await self.prisma.patient.find_unique(where={"id": patient_id})

#     async def update_patient(
#         self, patient_id: int, patient_data: UpdatePatientSchema
#     ) -> Patient:
#         """Update a patient's information."""
#         return await self.prisma.patient.update(
#             where={"id": patient_id},
#             data=patient_data.dict(
#                 exclude_unset=True
#             ),  # Only update fields that are set
#         )
