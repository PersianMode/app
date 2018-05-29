import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {TabsPage} from '../pages/tabs/tabs';
import {BagPage} from "../pages/bag/bag";
import {InboxPage} from "../pages/inbox/inbox";
import {ProfilePage} from "../pages/profile/profile";
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {AuthService} from '../services/auth.service';
import {HttpService} from '../services/http.service';
import {SocketService} from '../services/socket.service';
import {IonicStorageModule} from '@ionic/storage';
import {RegisterPage} from '../pages/register/register';
import {HttpClientModule} from '@angular/common/http';
import {RegConfirmationPage} from '../pages/regConfirmation/regConfirmation';
import {RegPreferencesPage} from '../pages/regPreferences/regPreferences';
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
import {CheckoutSummary} from '../pages/checkout/checkout-summary/checkout-summary';
import {CheckoutPaymentType} from '../pages/checkout/checkout-payment-type/checkout-payment-type';
import {CheckoutAddress} from '../pages/checkout/checkout-address/checkout-address';
import {AddressPage} from '../pages/address/address';
import {ReactiveFormsModule} from '@angular/forms';
import {GoogleMaps} from '@ionic-native/google-maps';
import {Geolocation} from '@ionic-native/geolocation';
import {GooglePlus} from '@ionic-native/google-plus';
import {ForgotPasswordPage} from '../pages/forgot-password/forgot-password';
import {DobComponent} from '../components/dob/dob';

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
    RegPreferencesPage,
    FilterPage,
    ProductSliding,
    SelectCount,
    CheckoutPage,
    CheckoutSummary,
    CheckoutPaymentType,
    CheckoutAddress,
    AddressPage,
    ProductItemComponent,
    SizeViewerComponent,
    ForgotPasswordPage,
    DobComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
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
    RegPreferencesPage,
    SelectCount,
    CheckoutPage,
    AddressPage,
    FilterPage,
    ForgotPasswordPage,
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
    GoogleMaps,
    Geolocation,
  ]
})
export class AppModule {
}
