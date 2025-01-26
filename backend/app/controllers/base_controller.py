from prisma import Prisma
from fastapi import Depends
from app.services.database import get_prisma


class BaseController:
    def __init__(self, prisma: Prisma = Depends(get_prisma)):
        self.prisma = prisma
