from prisma import Prisma
from typing import AsyncGenerator

# Global Prisma client instance
_prisma_client: Prisma | None = None


async def get_prisma() -> AsyncGenerator[Prisma, None]:
    """
    Dependency function to get a Prisma client.

    This function ensures a single Prisma client is created and reused,
    and properly manages the client's connection lifecycle.

    Yields:
        Prisma: A connected Prisma client
    """
    global _prisma_client

    # Create the Prisma client if it doesn't exist
    if _prisma_client is None:
        _prisma_client = Prisma()
        await _prisma_client.connect()

    try:
        yield _prisma_client
    finally:
        # Note: In most cases, you don't want to disconnect the global client
        # as it might be used by other parts of the application
        pass


async def close_prisma_connection():
    """
    Utility function to close the global Prisma client connection.

    This should be called during application shutdown.
    """
    global _prisma_client
    if _prisma_client is not None:
        await _prisma_client.disconnect()
        _prisma_client = None


def get_prisma_sync() -> Prisma:
    """
    Synchronous version of get_prisma for use in contexts
    that don't support async.

    Returns:
        Prisma: A connected Prisma client
    """
    global _prisma_client

    if _prisma_client is None:
        _prisma_client = Prisma()
        _prisma_client.connect()

    return _prisma_client
