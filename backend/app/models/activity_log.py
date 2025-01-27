from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import prisma


class ActivityLog(prisma):
    __tablename__ = "activity_log"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    action = Column(String)
    timestamp = Column(DateTime)
