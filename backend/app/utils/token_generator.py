import jwt
from datetime import datetime, timedelta
from typing import Any

# You should replace this with a secure secret key
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"  # HMAC SHA-256
TOKEN_EXPIRATION_MINUTES = 30  # Token expiration time in minutes


def generate_verification_token(
    data: dict, expiration_minutes: int = TOKEN_EXPIRATION_MINUTES
) -> str:
    """
    Generate a verification token.

    Args:
        data (dict): Data to encode in the token (e.g., user ID, email).
        expiration_minutes (int): Expiration time in minutes for the token.

    Returns:
        str: Encoded JWT token.
    """
    # Set the expiration time
    expiration = datetime.utcnow() + timedelta(minutes=expiration_minutes)
    data.update({"exp": expiration})  # Add expiration to the data

    # Generate the token
    token = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
    return token


def verify_token(token: str) -> Any:
    """
    Verify a token and return the decoded data.

    Args:
        token (str): The token to verify.

    Returns:
        Any: Decoded data if the token is valid, otherwise raises an exception.
    """
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_data
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")
