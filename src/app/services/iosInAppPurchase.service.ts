import {IAPProduct, InAppPurchase2} from "@ionic-native/in-app-purchase-2/ngx";
import {Platform} from "@ionic/angular";

export class IosInAppPurchaseService {

  productId = 'test';

  constructor(private platform: Platform, private store: InAppPurchase2) {
  }

  inAppPlatformReady(): void {
    this.platform.ready().then(() => {
      this.inAppRegisterCONSUMABLE()
    });
  }

  inAppApproved(): void {
    this.store.when(this.productId).approved(p => p.verify());
  }

  inAppVerified(): void {
    this.store.when(this.productId).verified(p => p.verify());
  }

  // Refresh the status of in-app products
  inAppRefresh(): void {
    this.store.refresh();
  }

  inAppRegisterCONSUMABLE(): void {
    this.store.register({
      id: this.productId,
      type: this.store.CONSUMABLE,
    });
  }

  // Register event handlers for the specific product
  inAppRegistered(): void {
    this.store.when(this.productId).registered((product: IAPProduct) => {
      console.log('Registered: ' + JSON.stringify(product));
    });
  }

  // Updated
  inAppUpdated(): void {
    this.store.when(this.productId).updated((product: IAPProduct) => {
      console.log('Updated' + JSON.stringify(product));
    });
  }

// User closed the native purchase dialog
  inAppCancell(): void {
    this.store.when(this.productId).cancelled((product) => {
      console.error('Purchase was Cancelled');
    });
  }

  // Track all store errors
  inAppError(): void {
    this.store.error((err) => {
      console.error('Store Error ' + JSON.stringify(err));
    });
  }

// Run some code only when the store is ready to be used
  inAppReady(): void {
    this.store.ready(() => {
      console.log('Store is ready');
      console.log('Products: ' + JSON.stringify(this.store.products));
      console.log(JSON.stringify(this.store.get("my_product_id")));
    });
  }

// To make a purchase
  inAppOrder(): void {
    this.store.order(this.productId);
  }
}
