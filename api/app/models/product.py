import uuid
from typing import Optional, List

from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTable, GUID
from pydantic import BaseModel, UUID4
from sqlalchemy import Column, String, Numeric, Integer

from ..db import Base


class ProductModel(BaseModel):
    id: Optional[UUID4]
    name: str
    image_url: str
    type: str
    price: float
    discount: float
    stock: int

    def to_api(self):
        product = Product(**self.dict())
        if product.id is None:
            product.id = uuid.uuid4()
        return product


class PaginatedProductModel(BaseModel):
    items: List[ProductModel]
    has_previous: bool
    has_next: bool
    total: int
    pages: int


class Product(Base):
    """Product Database Table ORM object"""
    __tablename__ = "product"

    id = Column(GUID, primary_key=True)
    name = Column(String, index=True, nullable=False)
    image_url = Column(String, index=True, nullable=False)
    type = Column(String, index=True, nullable=False)
    price = Column(Numeric, nullable=False)
    discount = Column(Numeric, nullable=True)
    stock = Column(Integer, nullable=False)

    def to_model(self):
        return ProductModel(**self.__dict__)
