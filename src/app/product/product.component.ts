import { Product } from './../model/product';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgModule } from '@angular/core';

import {
  PoDynamicFormField,
  PoDynamicFormFieldChanged,
  PoDynamicFormValidation,
  PoListViewAction,
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoPageAction,
  PoPageFilter
} from '@po-ui/ng-components';
import { ProductService } from '../service/product.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  @ViewChild('addProductsModal', { static: true }) addProductsModalElement: PoModalComponent | undefined;

  @ViewChild('deleteProductsModal', { static: true }) deleteProductsModal: PoModalComponent | undefined;

  products: Array<Product> = [];
  productsFiltered: Array<object> = [];
  labelFilter: string = '';
  selectedActionItem!: Product;
  titleaddProductsModal: string = 'Products Info - Register';
  logged: boolean = false;
  redirect: boolean = false;
  newProduct : Product = {nome: '', preco: 0, estoque: 0};
  public close!: PoModalAction;
  public confirm!: PoModalAction;

  product = {
    description: "",
    price: 0,
    stock: "",
    id: 0,
    new: true
  };
  validateFields: Array<string> = ['description','price'];

  readonly actions: Array<PoListViewAction> = [
    {
      label: 'Update',
      action: this.updateProduct.bind(this),
      icon: 'po-icon po-icon-document-filled'
    },
    {
      label: 'Delete',
      action: this.deleteProduct.bind(this),
      type: 'danger',
      icon: 'po-icon po-icon-minus-circle'
    }
  ];

  readonly pageActions: Array<PoPageAction> = [
    {
      label: 'Register',
      action: this.addProduct.bind(this),
      icon: 'po-icon po-icon-plus'
    },
  ];

  readonly filterSettings: PoPageFilter = {
    action: this.productsFilter.bind(this),
    placeholder: 'Search'
  };

  fields: Array<PoDynamicFormField> = [
    {
      property: 'description',
      divider: 'PRODUCT DATA',
      required: true,
      minLength: 4,
      maxLength: 50,
      gridColumns: 6,
      gridSmColumns: 12,
      order: 1,
      placeholder: 'Type description'
    },
    {
      property: 'price',
      type: 'currency',
      required: true,
      gridColumns: 6,
      decimalsLength: 2,
      thousandMaxlength: 7,
      icon: 'po-icon-finance'
    },
    {
      property: 'stock',
      divider: 'MORE INFO',
      gridColumns: 6,
      gridSmColumns: 12,
      optional: true,
      options: ['10-Local', '20-Local', '30-Local', '40-Local'],
      optionsMulti: false
    }
  ];

  constructor(
    public poNotification: PoNotificationService,
    private router: Router,
    private productService: ProductService
  )
  {
    const nav = this.router.getCurrentNavigation();
    this.logged = nav?.extras?.state?.success;
    // console.log(nav?.extras?.state?.success,"nav?.extras?.state?.success;")
    // if (!this.logged && !this.redirect)
    //   this.router.navigateByUrl('');
  }

  ngOnInit() {
    this.setActionModalDelete()
    this.loadProduct();

  }

  private loadProduct() {
    this.productService.getAll()
      .subscribe(product => {
        console.log(product, 'produtos via api');
        this.products = product;
        this.productsFiltered = [...this.products];
      });
  }

  setActionModalDelete(): void {
    this.close = {
      action: () => {
        this.deleteProductsModal?.close();
      },
      label: "Cancel",
    };

    this.confirm = {
      action: () => {
        this.confirmDelete();
        this.deleteProductsModal?.close();
      },
      danger: true,
      label: "Confirm"
    };
  }

  formatTitle(item: Product) {
    return `${item.produtoId} - ${item.nome}`;
  }


  private deleteProduct(selectedCandidate: any) {
    this.selectedActionItem = selectedCandidate;
    this.deleteProductsModal?.open();
  }

  private confirmDelete(){
      this.productService.deleteItem(this.selectedActionItem.produtoId)
        .subscribe(
          res => this.poNotification.success("successfully deleted"),
          err => this.poNotification.error(`Error: ${err.message}`)
        )
      this.deleteProductsModal?.close()
      this.redirectTo();
  }

  private updateProduct(item: any) {
    this.product.description = item.nome;
    this.product.price = item.preco;
    this.product.stock = `${item.estoque}-Local`;
    this.product.new = false;
    this.product.id = item.produtoId;

    this.addProductsModalElement?.open();
  }

  private productsFilter(labelFilter: string) {
    const filters = typeof labelFilter === 'string' ? [labelFilter] : [...labelFilter];
    console.log(filters,'logged')
    console.log(labelFilter,'labelFilter')
    this.productsFiltered = this.products.filter(item => item.nome.toUpperCase().includes(labelFilter.toUpperCase()) );
  }

  private addProduct(action: Function) {
    this.addProductsModalElement?.open();
  }

  register(){
    if (this.product?.description){
      this.prepareProduct();

      if (this.product.new)
      {
        this.addItem()
      }
      else
      {
        this.updateItem()
      }
      this.addProductsModalElement?.close();
      this.redirectTo();
    }
    else{
      this.poNotification.error('Description is required!');
    }
  }

  private prepareProduct() {
    this.newProduct.nome = this.product?.description;
    this.newProduct.preco = this.product.price;
    this.newProduct.estoque = parseInt(this.product.stock.substring(0, 2));
    if (this.product.id)
        this.newProduct.produtoId = this.product.id
  }

  private addItem()
  {
    this.productService.addItem(this.newProduct)
        .subscribe(item=> {
          if (item !== undefined)
            this.poNotification.success('Data saved successfully!');
          else
            this.poNotification.error('problems with data!');

        },
        err => this.poNotification.error(err.message))
  }

  private updateItem()
  {
    this.productService.updateItem(this.newProduct,this.newProduct.produtoId)
        .subscribe(item=> {
          if (item !== undefined)
            this.poNotification.success('Data saved successfully!');
          else
            this.poNotification.error('problems with data!');

        },
        err => {
          console.log(err, 'error')
          this.poNotification.error(err.message)
        })
  }

  redirectTo()
  {
    this.redirect = true;
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true,state: {success: true}}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }
}


