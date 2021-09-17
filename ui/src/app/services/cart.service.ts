import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Cart, CartItem } from "../types/Entity.Types";
import { HttpService } from "./http.service";
import { ServiceBase } from "./service.base";


@Injectable({
  providedIn: 'root'
})
export class CartService extends ServiceBase<Cart> {
  cart: Cart;
  items: CartItem[] = [];

  constructor(public readonly _http: HttpService) {
    super('/api/cart', Cart, _http);
  }

  get grandTotal(): number {
    const total = this.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    return Number(Number(total).toFixed(2));
  }

  async loadCart() {
    const cart = await this._http.getOne(this.endpoint, Cart).toPromise();
    if (cart !== null) {
      this.cart = cart;
      this.items = await this._http.get(`${this.endpoint}/items`, CartItem).toPromise();
    }
  }

  getOrderItems(cartId: string): Observable<CartItem[]> {
    return this._http.get(`${this.endpoint}/items/${cartId}`, CartItem);
  }

  async clearCart() {
    this.cart = new Cart();
    this.items = [];
  }

  addProductToCart(product_id: string): Observable<CartItem> {
    return this._http.post(`${this.endpoint}/products/add/${product_id}`, {}, CartItem)
      .pipe(map(result => {
        const itemIndex = this.items.findIndex((cartItem: CartItem) => cartItem.id === result.id);
        if (itemIndex >= 0) {
          this.items[itemIndex] = result;
        } else {
          this.items.push(result);
        }
        return result;
      }));
  }

  removeProductFromCart(cartItemId: string, quantity: number): Observable<void> {
    return this._http.post(`${this.endpoint}/products/remove`, {
      cart_item_id: cartItemId,
      quantity: quantity
    });
  }
}
