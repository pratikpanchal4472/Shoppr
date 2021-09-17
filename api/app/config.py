import os

from databases import DatabaseURL
from dotenv import load_dotenv
from starlette.datastructures import Secret

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # one week
load_dotenv(".env")
SECRET_KEY = Secret(os.getenv("JWT_SECRET"))
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT"))
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_URL = DatabaseURL(
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}"
)
