import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HttpModule, Http } from '@angular/http';


/**************Confif parameters****************/
import { FIREBASE_CONFIG } from './app.config';


/**************Providers************************/
import { AuthProvider } from '../providers/auth/auth';
import { FirestoreProvider } from '../providers/firestore/firestore';
import { AlertProvider } from '../providers/alert/alert';
import { ContextProvider } from '../providers/context/context';
import { EthapiProvider } from '../providers/ethapi/ethapi';
import { FidapiProvider } from '../providers/fidapi/fidapi';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { WalletProvider } from '../providers/wallet/wallet';
import { TransactionProvider } from '../providers/transaction/transaction';
import { Globalization } from '@ionic-native/globalization';


/**************Modules**************************/
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { IonicStorageModule } from '@ionic/storage';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService } from '@ngx-translate/core';


/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { LoginPageModule } from '../pages/login/login.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { ResetPasswordPageModule } from '../pages/reset-password/reset-password.module';
import { SendCoinsPageModule } from '../pages/send-coins/send-coins.module';
import { UpdatePageModule } from '../pages/update/update.module';


/*********************FIDEVER PRO************************/

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    HttpModule,
    IonicStorageModule.forRoot(),
    NgxQRCodeModule,
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    LoginPageModule,
    SignupPageModule,
    ResetPasswordPageModule,
    SendCoinsPageModule,
    UpdatePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    // SplashScreen,
    StatusBar,
    ScreenOrientation,
    AlertProvider,
    AuthProvider,
    ContextProvider,
    FirestoreProvider,
    FidapiProvider,
    EthapiProvider,
    BarcodeScanner,
    WalletProvider,
    TransactionProvider,
    TranslateService,
    Globalization
  ]
})
export class AppModule {}
