import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { FeedPage } from '../pages/feed/feed';
import { TabsPage } from '../pages/tabs/tabs';
import {ProductsPage} from "../pages/products/products";
import {BagPage} from "../pages/bag/bag";
import {InboxPage} from "../pages/inbox/inbox";
import {ProfilePage} from "../pages/profile/profile";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {CollectionPage} from "../pages/products/collection/collection";
import {LoginPage} from '../pages/login/login';
import {AuthService} from '../services/auth.service';
import {HttpService} from '../services/http.service';
import {SocketService} from '../services/socket.service';
import {IonicStorageModule} from '@ionic/storage';
import {RegisterPage} from '../pages/register/register';
import {HttpClientModule} from '@angular/common/http';
import {GooglePlus} from '@ionic-native/google-plus';
import {RegConfirmationPage} from '../pages/regConfirmation/regConfirmation';
import {ProductListPage} from '../pages/product-list/product-list';
import {ProductItemComponent} from '../components/product-item/product-item';
import {ProductService} from '../services/productService';
import {ProductViewPage} from "../pages/products/product-view/product-view";
import {ProductDetailPage} from "../pages/products/product-detail/product-detail";
import {SelectSizePage} from "../pages/products/select-size/select-size";
import {ProductFilterPage} from '../pages/product-list/filter/product-filter';
import {PageService} from '../services/page.service';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    ProductsPage,
    BagPage,
    InboxPage,
    ProfilePage,
    TabsPage,
    CollectionPage,
    ProductViewPage,
    ProductDetailPage,
    SelectSizePage,
    LoginPage,
    RegisterPage,
    RegConfirmationPage,
    ProductListPage,
    ProductItemComponent,
    ProductFilterPage
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
    ProductsPage,
    BagPage,
    InboxPage,
    ProfilePage,
    TabsPage,
    CollectionPage,
    LoginPage,
    ProductViewPage,
    ProductDetailPage,
    SelectSizePage,
    RegisterPage,
    RegConfirmationPage,
    ProductListPage,
    ProductFilterPage
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
    PageService
  ]
})
export class AppModule {}
