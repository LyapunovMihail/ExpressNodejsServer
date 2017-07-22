import { Component, OnInit, EventEmitter, ViewContainerRef} from '@angular/core';
import { ProductService } from './product.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { ToastsManager} from './node_modules/ng2-toastr/ng2-toastr';

@Component({
  selector: 'shop-products',
  templateUrl: 'products.component.html',
  styleUrls: [
  	'assets/bootshop/css/bootstrap.css',
  	'assets/bootshop/css/bootstrap-responsive.css',
  	'assets/bootshop/angular_components/style.css',	
  	'assets/bootshop/js/google-code-prettify/prettify.css',
  	'assets/css/progressusStyles.css',
    'assets/css/font-awesome.min.css'
  ]
})

export class ProductsComponent implements OnInit {
  constructor(
    private productService: ProductService,
    public toastr: ToastsManager, vcr: ViewContainerRef,
    private route: ActivatedRoute) { 
    this.toastr.setRootViewContainerRef(vcr);
  }

  categories = {growboxes: "Гроубоксы", lights: "Свет", automatics: "Автоматизация"}
  products: any
  productsInBucket: any
  category: any

  ngOnInit() {
    
    this.route.params
    .switchMap((params: Params) =>  
     this.productService.getCategoryProducts(this.categories[this.category = params['id']]) )
    .subscribe(products => this.products = products,
                err => console.log("httpError: ", err) );
  }


  purchaseProduct(product): void {
    console.log("product: ", product)
    this.productService
      .purchaseProduct(product)
      .then(products => {
        console.log("productsInBucket: ", products)
        this.productsInBucket = products
        this.productService.onPurchased(this.productsInBucket.numberOfPurchasedProducts)
        this.toastr.success('Товар добавлен в корзину');
      }, err => {
         this.toastr.error('Товар не был добавлен в корзину', 'Ошибка');
      });
  }

}
