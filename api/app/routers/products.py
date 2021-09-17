from typing import List

from fastapi import APIRouter, Depends, Body

from ..db import get_session
from ..models.product import ProductModel, PaginatedProductModel
from ..services.product_service import ProductService

products_router = APIRouter()


@products_router.get("/paginate", response_description="Paginate Products", response_model=PaginatedProductModel)
async def requests(page: int = 1, size: int = 20, filter_by: str = '', order_by: str = '',
                   session=Depends(get_session)):
    page = await ProductService(session).paginate(page, size, filter_by, order_by)
    paginated_response = PaginatedProductModel(
        items=[product.to_model() for product in page.items],
        has_previous=page.has_previous,
        has_next=page.has_next,
        total=page.total,
        pages=page.pages,
    )
    return paginated_response


@products_router.post("", response_description="Paginate Products", response_model=List[ProductModel])
async def bulk_insert(products: List[ProductModel] = Body(...), session=Depends(get_session)):
    await ProductService(session).bulk_insert([product.to_api() for product in products])
    return {}


@products_router.get("/types", response_description="Product Types", response_model=List[str])
async def product_type(session=Depends(get_session)):
    return await ProductService(session).types()
