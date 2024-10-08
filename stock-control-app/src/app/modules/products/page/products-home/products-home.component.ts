import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductsDataTransferService } from './../../../../services/products/products-data-transfer.service';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductFormComponent } from '../../components/product-form/product-form.component';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject<void>();
  private ref!: DynamicDialogRef;
  public productsDatas: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDataTransferService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
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

  public handleProductAction($event: EventAction): void {
    if ($event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: $event?.action,
        width: '70%',
        contentStyle: {overflow: 'auto'},
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: $event,
          productDatas: this.productsDatas
        },
      });
      this.ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => this.getAPIProducts(),
        });
    }
  }

  public handleDeleteProductAction($event: {
    product_id: string,
    productName: string }): void {
      if ($event) {
        this.confirmationService.confirm({
          message: `Confirma a exclusão do produto: ${$event.productName}?`,
          header: 'Confirmação de exclusão',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sim',
          rejectLabel: 'Não',
          accept: () => {
            this.deleteProduct($event?.product_id);
          }
        })
      }
  }

  public deleteProduct(product_id: string): void {
    if (product_id) {
        this.productsService.deleteProduct(product_id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto removido com sucesso !',
                life: 2500,
              });
              this.getAPIProducts();
            }
          }, error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao remover o produto !',
              life: 2500,
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
