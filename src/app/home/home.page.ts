import {ChangeDetectorRef, Component} from '@angular/core';
import {AlertController, Platform} from "@ionic/angular";
import {InAppPurchase2} from "@ionic-native/in-app-purchase-2/ngx";
import {error} from "@angular/compiler/src/util";
import {BrowserService} from "../services/browser.service";
import {InAppPurchase} from "@ionic-native/in-app-purchase/ngx";
import {IAPProduct} from "@ionic-native/in-app-purchase-2";

const test1 = 'test';
const test2 = 'test.test.test.xoals';
const test3 = 'test.test.subscribe';
const test4 = 'test.test.subscribe2';
const test5 = 'test.test.subscribe3';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gems = 0;
  isPro = false;
  products: IAPProduct[] = [];

  constructor(private plt: Platform, private store: InAppPurchase2, private alertController: AlertController, private ref: ChangeDetectorRef) {
    this.plt.ready().then(() => {
      // Only for debugging!
      // this.store.verbosity = this.store.DEBUG;
      this.store.when(test3).owned((p:IAPProduct)=>{

        // console.log('정기 결제 구독1 확인');
      });
      this.store.when(test4).owned((p:IAPProduct)=>{
        // console.log('정기 결제 구독2 확인');
      });

      this.registerProducts();

      this.setupListeners();


      // Get the real product information
      this.store.ready(() => {

        console.log(this.store.products.length+" id 확인 과연");
        this.products = this.store.products;
        this.ref.detectChanges();
      });

      this.registerHandlers(test3);
      this.registerHandlers(test4);
      this.registerHandlers(test5);

    });
  }

  registerHandlers(productId) {
    // Handlers
    //
    // this.store.when(productId).owned( (product: IAPProduct) => {
    //   //Place code to activate what happens when your user already owns the product here
    //   // console.log(productId+' : 확인 owned : '+product.owned);
    //   // console.log(productId+' : 확인 canPurchase : '+product.canPurchase);
    //   console.log(productId+' : 확인 전체 : ' + JSON.stringify(product));
    // });

    // this.store.when(productId).registered( (product: IAPProduct) => {
    //   console.log(productId+' : 확인 Registered: ' + JSON.stringify(product));
    // });

    this.store.when(productId).updated( (product: IAPProduct) => {
      console.log(productId+' : 확인 updated' + JSON.stringify(product));
    });
    //
    // this.store.when(productId).cancelled( (product) => {
    //   console.log(productId+' : 확인 cancelled' + JSON.stringify(product));
    // });

    // Overall Store Error
    this.store.error( (err) => {
      console.log(productId+' : err : '+err);
    });
  }

  registerProducts() {
    this.store.register([{
        id: test3,
        type: this.store.PAID_SUBSCRIPTION,
      },{
        id: test4,
        type: this.store.PAID_SUBSCRIPTION,
      }, {
        id: test5,
        type: this.store.PAID_SUBSCRIPTION,
      }, {
        id: test1,
        type: this.store.CONSUMABLE,
      }, {
        id: test2,
        type: this.store.CONSUMABLE,
        }]
    );
    //
    // this.store.register({
    //   id: test1,
    //   type: this.store.CONSUMABLE,
    // });
    //
    // this.store.register({
    //   id: test2,
    //   type: this.store.CONSUMABLE,
    // });


    this.store.refresh();

  }

  setupListeners() {
    // this.store.validator = 'https://billing.fovea.cc/';
    // General query to all products
    this.store.when('product')
    .approved((p: IAPProduct) => {
      // Handle the product deliverable
      if (p.id === test1) {
        this.isPro = true;
      } else if (p.id === test2) {
        this.gems += 100;
      }
      this.ref.detectChanges();
      return p.verify();
    })
    .verified((p: IAPProduct) => {
      p.finish();

    });
    this.store.when('my_product_id')
    .cancelled(p=>{
      console.log('cancelled!!!!' + p) });

    // Specific query for one ID
    this.store.when(test1).owned((p: IAPProduct) => {
      this.isPro = true;
    });

  }

  purchase(product: IAPProduct) {
    this.store.order(product).then(p => {
      // Purchase in progress!
      console.log("구입 완료 ");
    }, e => {
      console.log("에러 발생!!!");
      this.presentAlert('Failed', `Failed to purchase: ${e}`);
    });
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh();
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  log(m: string){
    console.log('ERROR MESSAGE !!!!!!!!!!!' + m);
  }
}
