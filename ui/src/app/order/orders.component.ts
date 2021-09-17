import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { CartService } from '../services/cart.service';
import { OrderService } from '../services/order.service';
import { Order } from '../types/Entity.Types';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private orderService: OrderService, private cartService: CartService) { }

  async ngOnInit(): Promise<void> {
    this.orders = await this.orderService.findAll().toPromise();
  }

  getDate(date: any) {
    return moment(date).format('MMMM Do YYYY, h:mm a');
  }

  async onExapnd(order: Order) {
    order.cart_items = await this.cartService.getOrderItems(order.cart_id).toPromise();
  }

}
