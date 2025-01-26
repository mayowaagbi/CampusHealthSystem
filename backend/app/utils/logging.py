import logging
import sys
from logging.handlers import RotatingFileHandler

# Configure the logger
logger = logging.getLogger("app_logger")
logger.setLevel(logging.DEBUG)  # Set the logging level

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)  # Set level for console output

# Create file handler with rotation
file_handler = RotatingFileHandler("app.log", maxBytes=5 * 1024 * 1024, backupCount=2)
file_handler.setLevel(logging.DEBUG)  # Set level for file output

# Create formatter and add it to the handlers
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add the handlers to the logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)

# Optional: Disable logging for specific libraries (e.g., SQLAlchemy)
logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
