from typing import Optional, List

from pydantic import UUID4

from ..db import ServiceBase
from ..models.order import Order


class OrderService(ServiceBase):
    async def find_by_id(self, order_id: str) -> Optional[Order]:
        """Find Order By id, returns None if not Present"""
        try:
            return self.session.query(Order).filter(Order.id == UUID4(order_id)).first()
        finally:
            self.session.close()

    async def find_by_user(self, user_id: str) -> List[Order]:
        try:
            return self.session.query(Order).filter(Order.user_id == UUID4(user_id)).order_by(Order.created_on.desc())
        finally:
            self.session.close()

    async def save(self, order: Order):
        try:
            self.session.merge(order)
            self.session.commit()
        finally:
            self.session.close()
