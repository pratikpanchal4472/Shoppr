from typing import List

from fastapi import APIRouter, Depends, Body

from .users import fast_api_users
from ..db import get_session
from ..models.cart import CartItemModel, CartItemRemoveRequest, CartModel
from ..models.user import UserDB
from ..services.cart_service import CartService

cart_router = APIRouter()


@cart_router.get("", response_description="Get Current User Cart", response_model=CartModel)
async def get_current_user_cart(
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    cart = await CartService(session).find_cart_by_user(str(session_user.id))
    return cart.to_model() if cart is not None else None


@cart_router.get("/items", response_description="Cart Items", response_model=List[CartItemModel])
async def items(
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    return await CartService(session).find_cart_items(str(session_user.id))


@cart_router.get("/items/{cart_id}", response_description="Cart Items", response_model=List[CartItemModel])
async def items(
        cart_id: str,
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    return await CartService(session).find_order_cart(cart_id)


@cart_router.post("/products/add/{product_id}", response_description="Add Cart Item", response_model=CartItemModel)
async def add_product(
        product_id: str,
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    return await CartService(session).add_product(str(session_user.id), product_id)


@cart_router.post("/products/remove", response_description="Remove Cart Item")
async def remove_product(
        request: CartItemRemoveRequest = Body(...),
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    return await CartService(session).remove_product(request.cart_item_id, request.quantity)
