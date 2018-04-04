import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import {BagPage} from "../pages/bag/bag";
import {InboxPage} from "../pages/inbox/inbox";
import {ProfilePage} from "../pages/profile/profile";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {AuthService} from '../services/auth.service';
import {HttpService} from '../services/http.service';
import {SocketService} from '../services/socket.service';
import {IonicStorageModule} from '@ionic/storage';
import {RegisterPage} from '../pages/register/register';
import {HttpClientModule} from '@angular/common/http';
import {GooglePlus} from '@ionic-native/google-plus';
import {RegConfirmationPage} from '../pages/regConfirmation/regConfirmation';
import {ProductService} from '../services/productService';
import {ProductViewPage} from "../pages/products/product-view/product-view";
import {ProductDetailPage} from "../pages/products/product-detail/product-detail";
import {SelectSizePage} from "../pages/products/select-size/select-size";
import {PageService} from '../services/page.service';
import {FeedPage} from '../pages/feed/feed';
import {CollectionsPage} from '../pages/collections/collections';
import {FilterPage} from '../pages/filter/filter';
import {MyShopPage} from '../pages/my-shop/my-shop';
import {CartService} from "../services/cart.service";
import {DictionaryService} from '../services/dictionary.service';
import {ProductSliding} from "../pages/bag/product-sliding/product-sliding";
import {SelectCount} from "../pages/bag/select-count/select-count";
import {ProductItemComponent} from '../components/product-item/product-item';
import {SizeViewerComponent} from "../components/size-viewer/size-viewer";
import {CheckoutService} from '../services/checkout.service';
import {CheckoutPage} from "../pages/checkout/checkout";
import {CheckoutSummaryPage} from '../pages/checkout-summary/checkout-summary';
import {CheckoutPaymentTypePage} from '../pages/checkout-payment-type/checkout-payment-type';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    MyShopPage,
    CollectionsPage,
    BagPage,
    InboxPage,
    ProfilePage,
    TabsPage,
    ProductViewPage,
    ProductDetailPage,
    SelectSizePage,
    LoginPage,
    RegisterPage,
    RegConfirmationPage,
    FilterPage,
    ProductSliding,
    SelectCount,
    CheckoutPage,
    CheckoutSummaryPage,
    CheckoutPaymentTypePage,
    ProductItemComponent,
    SizeViewerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    MyShopPage,
    CollectionsPage,
    BagPage,
    InboxPage,
    ProfilePage,
    TabsPage,
    LoginPage,
    ProductViewPage,
    ProductDetailPage,
    SelectSizePage,
    RegisterPage,
    RegConfirmationPage,
    SelectCount,
    CheckoutPage,
    CheckoutSummaryPage,
    CheckoutPaymentTypePage,
    FilterPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    HttpService,
    SocketService,
    GooglePlus,
    ProductService,
    PageService,
    CartService,
    DictionaryService,
    CheckoutService,
  ]
})
export class AppModule {}
