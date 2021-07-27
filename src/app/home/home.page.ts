import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AlertController, Platform} from '@ionic/angular';
import {InAppPurchase2} from '@ionic-native/in-app-purchase-2/ngx';
import {error} from '@angular/compiler/src/util';
import {BrowserService} from '../services/browser.service';
import {InAppPurchase} from '@ionic-native/in-app-purchase/ngx';
import {IAPProduct} from '@ionic-native/in-app-purchase-2';

const test1 = 'xoals.xoals.xoals.test1';
const test2 = 'xoals.xoals.xoals.test2';
const test3 = 'xoals.xoals.xoals.test3';
const test4 = 'xoals.xoals.xoals.test4';
const test5 = 'xoals.xoals.xoals.test5';
const test6 = 'com.xoals.inapp';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage implements OnInit{
  gems = 0;
  isPro = false;
  productIds =[test1,test2,test3,test4,test5,test6];
  products: IAPProduct[];
  isMonthOneMore= false;
  isDayOneMore= false;
  isDayNo= false;
  freeAfterDay= false;
  freeAfterDay2= false;
  freeAfterDay3= false;
  ck = false;

  constructor(private plt: Platform, private store: InAppPurchase2, private alertController: AlertController, private ref: ChangeDetectorRef) {
    this.plt.ready().then(() => {
      // Only for debugging!
      this.setupListeners();
      // Set Debug High
      this.store.verbosity = this.store.DEBUG;
      // Get the real product information
      this.store.ready(() => {
        console.log(' 길이 ' + this.store.products.length);
        this.products = this.store.products;
        this.ref.detectChanges();

      });
      this.registerProducts();
    });
  }

  ngOnInit() {

  }

  registerProducts() {
    this.store.register([{
        id: test1,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test2,
        type: this.store.PAID_SUBSCRIPTION
      },{
        id: test3,
        type: this.store.FREE_SUBSCRIPTION
      },{
        id:test4,
        type: this.store.FREE_SUBSCRIPTION
      },{
        id:test5,
        type: this.store.FREE_SUBSCRIPTION
      }]
    );
    this.store.refresh();
  }

  setupListeners() {
    // this.store.validator ='https://validator.fovea.cc/v1/validate?appName=com.xoals.xoals.inapp&apiKey=94979341-8659-4003-b010-e44f8cce90a9';
    // General query to all products
    this.onApproved(test1);
    this.onApproved(test3);
    this.onApproved(test4);
    this.onApproved(test5);
    this.onApproved(test2);
  }

  purchase(product: IAPProduct) {
    this.store.order(product).then(p => {
      // this.dataChange(p);
    }, e => {
      this.presentAlert('Failed', `Failed to purchase: ${e}`);
    });
  }

  // To comply with AppStore rules
  restore() {
    this.store.refresh().completed(() => {
      console.log('asd');
    });
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  dataChange(p:IAPProduct): void{
      // if(p.id==='com.xoals.inapp'){
      //   console.log('application 확인후 제거!!')
      //   p.set('state','');
      //   p.set('valid','false');
      //   p.set('in_app_ownership_type','no');
      //   // this.products = this.store.products;
      //   // this.ref.detectChanges();
      // }
  }
  onApproved( id : string){
    this.store.when(id).approved((p: IAPProduct) => {
      // Handle the product deliverable
      if(id===p.id){
        this.boolDataChange(id,true);
      }
      this.ref.detectChanges();
      return p.verify();
    })
    .verified((p: IAPProduct) => {
      p.finish();
    });

    /*({id, owned}: IAPProduct)*/
    this.store.when(id).updated(p=>{
      console.log(`[데이터 확인확인] id = ${p.id}  / owned = ${p.owned}  /  state = ${p.state}`);
      if(p.owned){
        if(p.id === id){
          this.boolDataChange(id,true);
        }
      }
      else{
        if(p.id === id){
          this.boolDataChange(id,false);
        }
      }
      if(p.id===test6){
        p.set('appStoreReceipt',' ');
      }

      this.ref.detectChanges();
    });
  }

  boolDataChange(id : string,bool: boolean){
    if(id===test1){
      this.isMonthOneMore = bool;
    }
    else if(id===test2){
      this.isDayOneMore = bool;
    }
    else if(id===test3){
      this.isDayNo = bool;
    }
    else if(id===test4){
      this.freeAfterDay = bool;
    }
    else if(id===test5){
      this.freeAfterDay2 = bool;
    }
  }
}

