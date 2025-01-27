# app/utils/password_hasher.py
from passlib.context import CryptContext

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt

    Args:
        password (str): Plain text password

    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain text password against a hashed password

    Args:
        plain_password (str): Plain text password
        hashed_password (str): Hashed password to compare against

    Returns:
        bool: True if password is correct, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)
