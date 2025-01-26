from datetime import datetime, timedelta, timezone
from typing import Tuple, Optional


def get_date_range(
    days: Optional[int] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
) -> Tuple[datetime, datetime]:
    """
    Get a date range based on the provided parameters.

    Args:
        days (Optional[int]): Number of days to look back from today.
        start_date (Optional[datetime]): Custom start date.
        end_date (Optional[datetime]): Custom end date.

    Returns:
        Tuple[datetime, datetime]: A tuple containing the start and end dates.
    """
    if start_date and end_date:
        return start_date, end_date

    if days is not None:
        end_date = datetime.now(timezone.utc)  # Use timezone-aware UTC now
        start_date = end_date - timedelta(days=days)
        return start_date, end_date

    # Default to the last 30 days if no parameters are provided
    end_date = datetime.now(timezone.utc)  # Use timezone-aware UTC now
    start_date = end_date - timedelta(days=30)
    return start_date, end_date
