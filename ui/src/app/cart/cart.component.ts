import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { CartItem, Order } from '../types/Entity.Types';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  constructor(
    public readonly cartService: CartService,
    public readonly orderService: OrderService,
    private _snakcBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  async increaseQuantity(cartItem: CartItem) {
    await this.cartService.addProductToCart(cartItem.product.id).toPromise();
  }

  async decreaseQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    await this.cartService.removeProductFromCart(cartItem.id, cartItem.quantity).toPromise();
    if (cartItem.quantity === 0) {
      this.cartService.items.splice(this.cartService.items.indexOf(cartItem), 1);
    }
  }

  async onPlaceOrder() {
    await this.orderService.
      save(new Order(this.cartService.cart.id, this.cartService.grandTotal)).toPromise();
    this.cartService.clearCart();
    this._snakcBar.open('Order has been placed successfully.', 'x', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
      panelClass: ['bg-success', 'bg-gradient']
    });
    this.router.navigate(['/orders']);
  }
}
