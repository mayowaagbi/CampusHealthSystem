# app/schemas/analytics_schemas.py
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
from enum import Enum


class HealthTrendType(str, Enum):
    MOOD = "MOOD"
    MEDICAL_CONDITION = "MEDICAL_CONDITION"
    MENTAL_HEALTH = "MENTAL_HEALTH"


class AppointmentStatType(str, Enum):
    BY_PROVIDER = "BY_PROVIDER"
    BY_STATUS = "BY_STATUS"
    BY_PRIORITY = "BY_PRIORITY"


class UserEngagementMetric(str, Enum):
    JOURNAL_ENTRIES = "JOURNAL_ENTRIES"
    MOOD_TRACKING = "MOOD_TRACKING"
    APPOINTMENT_FREQUENCY = "APPOINTMENT_FREQUENCY"


class AnalyticsPeriod(str, Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"
    QUARTERLY = "QUARTERLY"
    YEARLY = "YEARLY"


class HealthTrendRequestSchema(BaseModel):
    trend_type: HealthTrendType
    period: AnalyticsPeriod = AnalyticsPeriod.MONTHLY
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    group_by: Optional[str] = None


class AppointmentStatsRequestSchema(BaseModel):
    stat_type: AppointmentStatType
    period: AnalyticsPeriod = AnalyticsPeriod.MONTHLY
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class UserEngagementRequestSchema(BaseModel):
    metric: UserEngagementMetric
    period: AnalyticsPeriod = AnalyticsPeriod.MONTHLY
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class AnalyticsResultSchema(BaseModel):
    data: List[Dict]
    total_count: int
    average: Optional[float] = None
    trend: Optional[str] = None
