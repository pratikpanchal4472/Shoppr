from typing import Optional

from fastapi_users import models
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable
from sqlalchemy import Column, String

from ..db import Base


class User(models.BaseUser):
    name: str
    mobile_num: Optional[str]
    pass


class UserCreate(User, models.BaseUserCreate):
    pass


class UserUpdate(User, models.BaseUserUpdate):
    pass


class UserDB(User, models.BaseUserDB):
    pass


class UserTable(Base, SQLAlchemyBaseUserTable):
    """Users Database Table ORM object"""
    name = Column(String, index=True, nullable=False)
    mobile_num = Column(String, nullable=True)

    def to_model(self) -> UserDB:
        return UserDB(**self.__dict__)
