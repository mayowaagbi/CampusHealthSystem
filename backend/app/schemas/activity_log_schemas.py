# app/schemas/activity_log_schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ActivityLogSchema(BaseModel):
    id: int
    user_id: int
    action: str
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

    class Config:
        orm_mode = True


class ActivityLogFilterSchema(BaseModel):
    user_id: Optional[int] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    action: Optional[str] = None
