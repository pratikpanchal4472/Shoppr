from fastapi import Depends
from fastapi.openapi.models import Response
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import JWTAuthentication
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from starlette.requests import Request

from ..config import SECRET_KEY, ACCESS_TOKEN_EXPIRE_MINUTES
from ..db import db_connection, connection
from ..models.user import UserDB, UserTable, User, UserCreate, UserUpdate

SECRET = str(SECRET_KEY)
jwt_authentication = JWTAuthentication(
    secret=SECRET,
    lifetime_seconds=ACCESS_TOKEN_EXPIRE_MINUTES,
    tokenUrl="/api/auth/jwt/login"
)


def on_after_register(user: UserDB, request: Request):
    print(f'{user.name} has been registered, generally we should send an email')


def on_after_forgot_password(user: UserDB, token: str, request: Request):
    print(f'{user.name} has forgot password, generally we should send an email')


def after_verification_request(user: UserDB, token: str, request: Request):
    print(f'{user.name} has been verified, generally we should send an email')


fast_api_users = FastAPIUsers(
    SQLAlchemyUserDatabase(UserDB, connection.db, UserTable.__table__),
    [jwt_authentication],
    User,
    UserCreate,
    UserUpdate,
    UserDB
)

auth_router = fast_api_users.get_auth_router(jwt_authentication)
register_router = fast_api_users.get_register_router(on_after_register)
reset_pass_router = fast_api_users.get_reset_password_router(SECRET, after_forgot_password=on_after_forgot_password)
verification_router = fast_api_users.get_verify_router(SECRET, after_verification_request=after_verification_request)
users_router = fast_api_users.get_users_router()


@auth_router.post("/logout")
async def refresh_jwt(response: Response, user=Depends(fast_api_users.current_user(active=True))):
    return await jwt_authentication.get_login_response(user, response)
