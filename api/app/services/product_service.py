from typing import Optional, List

from pydantic import UUID4
from sqlalchemy import func
from sqlalchemy_pagination import paginate, Page

from ..db import ServiceBase
from ..models.product import Product


class ProductService(ServiceBase):
    async def find_by_id(self, product_id: str) -> Optional[Product]:
        """Find Product By id, returns None if not Present"""
        try:
            product = self.session.query(Product).filter(Product.id == UUID4(product_id)).first()
        finally:
            self.session.close()
        return product

    async def paginate(
            self,
            page: int = 1,
            size: int = 20,
            filter_by: str = '',
            order_by: str = ''
    ) -> Page:
        """Paginate Products"""
        try:
            query = self.session.query(Product)

            if filter_by != '':
                filter_params = filter_by.split(',')
                query = query.filter(getattr(Product, filter_params[0]) == filter_params[1])

            if order_by != '':
                order_params = order_by.split(',')
                by = order_params[0]
                value = order_params[1]
                query = query.order_by(getattr(Product, by).desc()) if value == 'desc' else \
                    query.order_by(getattr(Product, by).asc())

            page = paginate(query, page, size)
        finally:
            self.session.close()
        return page

    async def bulk_insert(self, products: List[Product]):
        """Bulk Add Products"""
        try:
            self.session.add_all(products)
            self.session.commit()
        finally:
            self.session.close()

    async def types(self) -> List[str]:
        """Get Present Distinct Product Types"""
        try:
            records = self.session.query(Product.type).order_by(Product.type.asc()).distinct().all()
            product_types = [record[0] for record in records]
        finally:
            self.session.close()
        return product_types

    async def find_by_ids(self, product_ids: List[UUID4]) -> List[Product]:
        """Find Product By id, returns None if not Present"""
        try:
            products = self.session.query(Product).filter(Product.id.in_(product_ids))
        finally:
            self.session.close()
        return products
