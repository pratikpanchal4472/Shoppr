import datetime
import uuid
from typing import Optional, List

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable, GUID
from pydantic import BaseModel, UUID4
from sqlalchemy import Column, String, Numeric, ForeignKey, Integer, DateTime

from .cart import CartModel, CartItemModel
from ..db import Base


class OrderModel(BaseModel):
    id: Optional[UUID4]
    cart_id: UUID4
    user_id: Optional[UUID4]
    total: float
    created_on: Optional[datetime.datetime]

    def to_api(self):
        order = Order(**self.dict())
        if order.id is None:
            order.id = uuid.uuid4()
        return order


class Order(Base):
    __tablename__ = "order"
    # Other features can be added like payment reference, delivery status etc.

    id = Column(GUID, primary_key=True)
    cart_id = Column(GUID, ForeignKey('cart.id'), nullable=False)
    user_id = Column(GUID, ForeignKey('user.id'), nullable=False)
    total = Column(Numeric, nullable=False)
    created_on = Column(DateTime(timezone=True), nullable=False, default=datetime.datetime.utcnow)

    def to_model(self):
        return OrderModel(**self.__dict__)
