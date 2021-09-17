from enum import Enum
from typing import Optional

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable, GUID
from pydantic import BaseModel, UUID4
from sqlalchemy import Column, String, Numeric, ForeignKey, Integer

from .product import ProductModel
from ..db import Base


class CartState(str, Enum):
    PENDING = "PENDING"
    PROCESSED = "PROCESSED"


class CartModel(BaseModel):
    id: Optional[UUID4]
    user_id: UUID4
    state: CartState


class CartItemModel(BaseModel):
    id: Optional[UUID4]
    cart: CartModel
    product: ProductModel
    amount: float
    quantity: int


class CartItemRemoveRequest(BaseModel):
    cart_item_id: UUID4
    quantity: int


class Cart(Base):
    __tablename__ = "cart"

    """Product Database Table ORM object"""
    id = Column(GUID, primary_key=True)
    user_id = Column(GUID, ForeignKey('user.id'), nullable=False)
    state = Column(String, nullable=False)

    def to_model(self):
        return CartModel(**self.__dict__)


class CartItem(Base):
    __tablename__ = "cart_item"

    id = Column(GUID, primary_key=True)
    cart_id = Column(GUID, ForeignKey('cart.id'), nullable=False)
    product_id = Column(GUID, ForeignKey('product.id'), nullable=False)
    amount = Column(Numeric, nullable=False)
    quantity = Column(Integer, nullable=False)
