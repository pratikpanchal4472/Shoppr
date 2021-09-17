import { Component, OnInit } from '@angular/core';
import { CartService } from './services/cart.service';
import { HttpService } from './services/http.service';
import { AuthEndpoints } from './types/endpoints';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(
    private readonly _http: HttpService,
    public readonly cartService: CartService
  ) { }

  ngOnInit(): void {
  }

  async logout() {
    await this._http.post(AuthEndpoints.LOGOUT, {}, {} as any).toPromise();
    console.log('User has been logged out.');
  }
}
