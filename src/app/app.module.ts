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
import {SearchPage} from '../pages/search/search';
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
import {Deeplinks} from '@ionic-native/deeplinks';
import {LoadingService} from '../services/loadingService';
import {SocialSharing} from '@ionic-native/social-sharing';
import {OrdersPage} from '../pages/profile/orders/orders';
import {OrderService} from '../services/order.service';
import {OrderLinesPage} from '../pages/profile/order-lines/order-lines';
import {TooltipsModule} from 'ionic-tooltips';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {musicPlayerPage} from "../pages/music-player/music-player";
import {AudioProvider} from "../services/audio";
import { StoreModule } from '@ngrx/store';
import { mediaStateReducer } from '../pages/music-player/store';

@NgModule({
  declarations: [
    MyApp,
    FeedPage,
    MyShopPage,
    CollectionsPage,
    SearchPage,
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
    OrdersPage,
    OrderLinesPage,
    musicPlayerPage
  ],
  imports: [
    BrowserModule,
    TooltipsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    StoreModule.forRoot({
      appState: mediaStateReducer
    }),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FeedPage,
    MyShopPage,
    CollectionsPage,
    SearchPage,
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
    OrdersPage,
    OrderLinesPage,
    musicPlayerPage
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
    LoadingService,
    DictionaryService,
    CheckoutService,
    GoogleMaps,
    Geolocation,
    Deeplinks,
    SocialSharing,
    OrderService,
    AudioProvider,
  ]
})
export class AppModule {
}
