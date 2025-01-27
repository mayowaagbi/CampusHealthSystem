# app/models/log.py
from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
from app.database import prisma


class SystemLog(prisma):
    __tablename__ = "system_logs"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    level = Column(String)
    message = Column(String)
    source = Column(String)
    user_id = Column(Integer)
    ip_address = Column(String)
    context = Column(String)
