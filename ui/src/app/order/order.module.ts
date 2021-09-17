import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderRoutingModule } from './order-routing.module';
import { OrdersComponent } from './orders.component';



@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    MatExpansionModule,

  ]
})
export class OrderModule { }
