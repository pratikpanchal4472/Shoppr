import { Component, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService
  ) { }


  async ngOnInit(): Promise<void> {
    if (this.userService.isAuthenticated) {
      this.cartService.loadCart();
    }
  }
}
