from typing import List

from fastapi import APIRouter, Depends, Body

from .users import fast_api_users
from ..db import get_session
from ..models.order import Order, OrderModel
from ..models.user import UserDB
from ..services.cart_service import CartService
from ..services.order_service import OrderService

orders_router = APIRouter()


@orders_router.get("", response_description="Get Current User Orders", response_model=List[OrderModel])
async def get_current_user_orders(
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    orders = await OrderService(session).find_by_user(str(session_user.id))
    return [order.to_model() for order in orders]


@orders_router.post("", response_description="Save Order")
async def save_order(
        order: OrderModel = Body(...),
        session_user: UserDB = Depends(fast_api_users.current_user(active=True)),
        session=Depends(get_session)):
    order.user_id = session_user.id
    await OrderService(session).save(order.to_api())
    # mark cart as processed
    await CartService(session).cart_placed(str(order.cart_id))
    return {}
