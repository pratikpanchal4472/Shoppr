import uuid
from typing import Optional, List

from pydantic import UUID4

from .product_service import ProductService
from ..db import ServiceBase
from ..models.cart import Cart, CartItem, CartItemModel, CartState


class CartService(ServiceBase):
    async def find_by_id(self, cart_id: str) -> Optional[Cart]:
        """Find Product By id, returns None if not Present"""
        try:
            cart = self.session.query(Cart).filter(Cart.id == UUID4(cart_id)).first()
        finally:
            self.session.close()
        return cart

    async def find_cart_by_user(self, user_id: str, state: str = CartState.PENDING) -> Optional[Cart]:
        """Find Product By id, returns None if not Present"""
        try:
            cart = self.session.query(Cart).filter(Cart.user_id == UUID4(user_id), Cart.state == state).first()
        finally:
            self.session.close()
        return cart

    async def save_cart(self, cart: Cart):
        try:
            self.session.merge(cart)
            self.session.commit()
        finally:
            self.session.close()
        return cart

    async def save_cart_item(self, cart_item: CartItem):
        try:
            self.session.merge(cart_item)
            self.session.commit()
        finally:
            self.session.close()

    async def find_cart_item(self, cart_id: UUID4, product_id: UUID4) -> Optional[CartItem]:
        try:
            cart_item = self.session.query(CartItem).filter(
                CartItem.cart_id == cart_id,
                CartItem.product_id == product_id
            ).first()
        finally:
            self.session.close()
        return cart_item

    async def add_product(self, user_id: str, product_id: str) -> CartItemModel:
        try:
            cart = await self.find_cart_by_user(user_id)
            product = await ProductService(self.session).find_by_id(product_id)

            if cart is None:
                await self.save_cart(Cart(id=uuid.uuid4(), user_id=UUID4(user_id), state=CartState.PENDING))

            # get latest Cart record
            cart = await self.find_cart_by_user(user_id)
            cart_item = await self.find_cart_item(cart.id, product.id)

            if cart_item is not None:
                # Update cart Item by one since it is incremented
                cart_item.quantity = cart_item.quantity + 1
            else:
                cart_item = CartItem(
                    id=uuid.uuid4(),
                    cart_id=cart.id,
                    product_id=UUID4(product_id),
                    quantity=1,
                    amount=product.price
                )

            await self.save_cart_item(cart_item)
            cart_item = await self.find_cart_item(cart.id, product.id)

            return CartItemModel(
                id=cart_item.id,
                product=product.to_model(),
                cart=cart.to_model(),
                amount=cart_item.amount,
                quantity=cart_item.quantity
            )
        finally:
            self.session.close()

    async def remove_product(self, cart_item_id: UUID4, quantity: int):
        try:
            cart_item = self.session.query(CartItem).filter(CartItem.id == cart_item_id).first()
            if quantity == 0:
                self.session.delete(cart_item)
            else:
                cart_item.quantity = quantity
                await self.save_cart_item(cart_item)
        finally:
            self.session.close()

    async def find_cart_items(self, user_id: str) -> List[CartItemModel]:
        """Paginate Cart"""
        try:
            cart = await self.find_cart_by_user(user_id)
            return await self.find_items(cart)
        finally:
            self.session.close()

    async def find_order_cart(self, cart_id: str) -> List[CartItemModel]:
        """Paginate Cart"""
        try:
            cart = await self.find_by_id(cart_id)
            return await self.find_items(cart)
        finally:
            self.session.close()

    async def cart_placed(self, cart_id: str):
        """Paginate Cart"""
        try:
            cart = await self.find_by_id(cart_id)
            cart.state = CartState.PROCESSED
            await self.save_cart(cart)
        finally:
            self.session.close()

    async def find_items(self, cart: Cart):
        try:
            cart_items = self.session.query(CartItem).filter(CartItem.cart_id == cart.id)
            products = await ProductService(self.session).find_by_ids([item.product_id for item in cart_items])
            product_map = {product.id: product.to_model() for product in products}
            return [CartItemModel(
                id=item.id,
                product=product_map[item.product_id],
                cart=cart.to_model(),
                amount=item.amount,
                quantity=item.quantity
            ) for item in cart_items]
        finally:
            self.session.close()
