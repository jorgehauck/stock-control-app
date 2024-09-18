import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsDataTransferService } from './../../../../services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    const productsLoaded = this.productsDataTransferService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productsDatas = productsLoaded;
    } else {
      this.getAPIProducts();
    }
  }


  private getAPIProducts(): void {
    this.productsService.getAllProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.productsDatas = response;
        }

      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar os produtos !',
          life: 2500,
        })
        this.router.navigate(['/dashboard']);
      }
    })
  }




  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
