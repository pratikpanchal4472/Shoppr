from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from .db import connection, create_tables
from .routers.cart import cart_router
from .routers.orders import orders_router
from .routers.products import products_router
from .routers.users import auth_router, register_router, reset_pass_router, verification_router, users_router

app = FastAPI(title='Shoppr API')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# User Router endpoints from fastapi users
app.include_router(auth_router, prefix="/api/auth/jwt", tags=["auth"])
app.include_router(register_router, prefix="/api/auth", tags=["auth"])
app.include_router(reset_pass_router, prefix="/api/auth", tags=["auth"])
app.include_router(verification_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(products_router, prefix="/api/products", tags=["products"])
app.include_router(cart_router, prefix="/api/cart", tags=["cart"])
app.include_router(orders_router, prefix="/api/orders", tags=["orders"])


@app.on_event("startup")
async def startup():
    await connection.db.connect()
    create_tables()


@app.on_event("shutdown")
async def shutdown():
    await connection.db.disconnect()
