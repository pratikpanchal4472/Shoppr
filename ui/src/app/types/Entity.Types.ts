import { Exclude, Type } from "class-transformer";

export class UserBase {
  id: string;
  email: string;
  password: string;
  is_active: boolean = true;
  is_verified: boolean = true;
}

export class User extends UserBase {
  name: string;
  mobile_num?: string;
}

export class PaginateOptions {
  has_previous: boolean = false;
  has_next: boolean = false;
  total: number;
  pages: number;
}

export class PaginateProducts extends PaginateOptions {
  @Type(() => Product)
  items: Product[] = [];
}

export class Product {
  id: string;
  name: string;
  image_url: string;
  type: string;
  price: number;
  discount: number;
  stock: number;
}

export class Cart {
  id: string;
  user_id: string;
  state: string;
}

export class CartItem {
  id: string;
  cart: Cart;
  product: Product;
  amount: number;
  quantity: number;
}

export class Order {
  id: string;
  cart_id: string;
  user_id: string;
  total: number;
  created_on: string;

  @Exclude()
  cart_items: CartItem[] = [];


  constructor(
    cart_id: string,
    total: number
  ) {
    this.cart_id = cart_id
    this.total = total
  }
}
