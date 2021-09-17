from typing import Optional, List

from pydantic import UUID4

from ..db import ServiceBase
from ..models.user import UserTable


class UserService(ServiceBase):
    async def find_by_id(self, user_id: str) -> Optional[UserTable]:
        """Find User By id, returns None if not Present"""
        try:
            user = self.session.query(UserTable).filter(UserTable.id == UUID4(user_id)).first()
        finally:
            self.session.close()
        return user
