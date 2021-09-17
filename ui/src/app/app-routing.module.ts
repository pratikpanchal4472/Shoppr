import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { ProductsModule } from './products/products.module';

const routes: Routes = [
  { path: 'cart', loadChildren: () => CartModule },
  { path: 'orders', loadChildren: () => OrderModule },
  { path: '', loadChildren: () => ProductsModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
