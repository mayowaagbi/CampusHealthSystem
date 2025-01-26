# app/schemas/log_schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum


class LogLevel(str, Enum):
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class SystemLogSchema(BaseModel):
    id: int
    timestamp: datetime
    level: LogLevel
    message: str
    source: Optional[str] = None
    user_id: Optional[int] = None
    ip_address: Optional[str] = None
    context: Optional[dict] = None

    class Config:
        orm_mode = True


class LogFilterSchema(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    level: Optional[LogLevel] = None
    source: Optional[str] = None
    user_id: Optional[int] = None
