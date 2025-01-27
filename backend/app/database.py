from prisma import Prisma

# Initialize the Prisma client
prisma = Prisma()


async def connect_db():
    """Connect to the database."""
    await prisma.connect()


async def disconnect_db():
    """Disconnect from the database."""
    await prisma.disconnect()
