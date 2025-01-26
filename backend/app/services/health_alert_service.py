# app/services/health_alert_service.py
from typing import List, Dict
from prisma import Prisma
from prisma.errors import RecordNotFoundError

from app.schemas.health_alert_schemas import HealthAlertCreateSchema, HealthAlertSchema


class HealthAlertService:
    @staticmethod
    async def create_health_alert(
        prisma: Prisma, provider_id: int, health_alert_data: HealthAlertCreateSchema
    ) -> HealthAlertSchema:
        """
        Create a new health alert

        Args:
            prisma (Prisma): Prisma client
            provider_id (int): ID of the healthcare provider
            health_alert_data (HealthAlertCreateSchema): Health alert details

        Returns:
            HealthAlertSchema: Created health alert
        """
        try:
            # Validate provider exists
            provider = await prisma.provider.find_unique(where={"id": provider_id})
            if not provider:
                raise ValueError("Provider not found")

            # Create health alert
            new_alert = await prisma.healthalert.create(
                data={
                    "provider_id": provider_id,
                    "description": health_alert_data.description,
                    "severity": health_alert_data.severity,
                    "date": health_alert_data.date,
                }
            )

            return HealthAlertSchema.from_orm(new_alert)

        except Exception as e:
            raise ValueError(f"Error creating health alert: {str(e)}")

    @staticmethod
    async def get_health_alerts(
        prisma: Prisma, provider_id: int
    ) -> List[HealthAlertSchema]:
        """
        Retrieve health alerts for a specific provider

        Args:
            prisma (Prisma): Prisma client
            provider_id (int): ID of the healthcare provider

        Returns:
            List[HealthAlertSchema]: List of health alerts for the provider
        """
        try:
            alerts = await prisma.healthalert.find_many(
                where={"provider_id": provider_id},
                order_by={"date": "desc"},  # Order by date
            )

            return [HealthAlertSchema.from_orm(alert) for alert in alerts]

        except Exception as e:
            raise ValueError(f"Error retrieving health alerts: {str(e)}")

    @staticmethod
    async def delete_health_alert(
        prisma: Prisma, alert_id: int, provider_id: int
    ) -> Dict[str, str]:
        """
        Delete a health alert

        Args:
            prisma (Prisma): Prisma client
            alert_id (int): ID of the health alert to delete
            provider_id (int): ID of the healthcare provider

        Returns:
            Dict[str, str]: Deletion confirmation message
        """
        try:
            # Validate health alert exists
            alert = await prisma.healthalert.find_unique(
                where={"id": alert_id, "provider_id": provider_id}
            )
            if not alert:
                raise ValueError("Health alert not found")

            # Delete health alert
            await prisma.healthalert.delete(where={"id": alert_id})

            return {"message": "Health alert deleted successfully"}

        except RecordNotFoundError:
            raise ValueError("Health alert not found")
        except Exception as e:
            raise ValueError(f"Error deleting health alert: {str(e)}")
