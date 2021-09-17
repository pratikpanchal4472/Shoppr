import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, Observable } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { AuthWindowComponent } from '../auth/auth-window.component';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { PaginateOptions, PaginateProducts, Product } from '../types/Entity.Types';
import { Mapper } from '../utils/mapper';

export interface ProductOperation {
  filter: string,
  order: string,
  page: number
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  private subs = new SubSink();

  // For Operations like Filtering and Ordering
  operationSelectionSubject = new BehaviorSubject<ProductOperation>({ page: 1, filter: '', order: 'price,asc' });
  operationSelectionObservable = this.operationSelectionSubject.asObservable();

  productsObservable: Observable<Product[]>;
  paginateOptions: PaginateOptions;

  productTypes: string[] = [];

  productTypeFilter = new FormControl('');
  priceOrderFilter = new FormControl('asc');

  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly dialog: MatDialog,
    private readonly cartService: CartService
  ) {
    // Type Filter change subscribed
    this.subs.sink = this.productTypeFilter.valueChanges.subscribe((value: string) => {
      const operation = this.operationSelectionSubject.getValue() as ProductOperation;
      operation.filter = value !== '' ? `type,${value}` : '';
      this.operationSelectionSubject.next(operation);
    });

    // Price Order change subscribed
    this.subs.sink = this.priceOrderFilter.valueChanges.subscribe((value: string) => {
      const operation = this.operationSelectionSubject.getValue() as ProductOperation;
      operation.order = `price,${value}`;
      this.operationSelectionSubject.next(operation);
    });

    this.productsObservable = this.operationSelectionObservable.pipe(
      // on change of operations like filter or Order Product query will be triggerred.
      concatMap((operation: ProductOperation) => productService.paginate(operation.page, 10, operation.filter, operation.order)
        .pipe(map(result => {
          const paginatedResults = Mapper.toModel(PaginateProducts, result);
          this.paginateOptions = new PaginateOptions();
          this.paginateOptions.has_next = paginatedResults.has_next;
          this.paginateOptions.has_previous = paginatedResults.has_previous;
          this.paginateOptions.total = paginatedResults.total;
          this.paginateOptions.pages = paginatedResults.pages;
          return paginatedResults.items;
        })))
    )
  }

  async ngOnInit() {
    this.productTypes = await this.productService.getProductTypes().toPromise();
  }

  onPageChange($event: PageEvent) {
    const operation = this.operationSelectionSubject.getValue() as ProductOperation;
    operation.page = $event.pageIndex + 1;
    this.operationSelectionSubject.next(operation);
  }

  async onAddToCart(product: Product) {
    try {
      await this.validateAuthentication();
    } catch (e) {
      console.log('Unexpected Error occurred')
    }

    await this.cartService.addProductToCart(product.id).toPromise();
  }

  async validateAuthentication(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.userService.currentUser().toPromise();
        resolve();
      } catch (e) {
        const dialogRef = this.dialog.open(AuthWindowComponent, {
          width: '400px',
          data: {
            performPendingAction: async () => {
              dialogRef.close();
              resolve();
            }
          }
        });
      }
    });
  }
}
