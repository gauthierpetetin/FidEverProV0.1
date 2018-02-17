import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

// import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';

/**************Providers************************/
import { ContextProvider} from '../providers/context/context';
import { AuthProvider } from '../providers/auth/auth';

/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';


/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UpdatePage } from '../pages/update/update';


import { Globalization } from '@ionic-native/globalization';


/********************FIDEVER PRO**********************************/

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  appVersion: number = 1.1;

  rootPage:any;

  constructor(
    platform: Platform,
    afAuth: AngularFireAuth,
    authData: AuthProvider,
    public ctx: ContextProvider,
    // private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    translateService: TranslateService,
    private screenOrientation: ScreenOrientation,
    private globalization: Globalization
  ) {


    ctx.setMyAppVersion(this.appVersion);


    const authObserver = afAuth.authState.subscribe( user => {

      if (user) {
        console.log('userID : ', user.uid);
        console.log('userEmail : ', user.email);
        console.log('userDisplayName : ', user.displayName);
        console.log('photoURL : ', user.photoURL);

        ctx.init(user.uid, user.email, user.displayName, user.photoURL, true, false, true, ctx.fideverProContractAddress).then( (res) => {
          console.log('Context init success : ', res);
          this.goToHomePage(authObserver);
        }, (err) => {
          console.log('Context init error : ', err);
          if(err == ctx.getUpdateString() ){
            console.log('UPDATE');
            this.goToUpdatePage(ctx, authObserver);
          }
          else{
            // console.log('NO UPDATE');
            this.goToWelcomePage(ctx, authObserver);
          }
        });

      } else {
        console.log('AuthState subscription error');
        this.goToWelcomePage(ctx, authObserver);
      }
    });


    translateService.addLangs(["en", "fr", "es"]);
    translateService.setDefaultLang('en');

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //statusBar.backgroundColorByHexString('#fe9400');
      //statusBar.hide();
      //splashScreen.hide();
      if (platform.is('cordova')) {
        console.log('Cordova platform');
        ctx.cordovaPlatform = true;
        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      }
      else{
        ctx.cordovaPlatform = false;
        console.log('Not a cordova platform');
      }


      if ((<any>window).cordova ) {
        this.globalization.getPreferredLanguage().then(result => {
          var language = result.value;
          language = language.substring(0, 2).toLowerCase();
          if(language == 'fr') {
            translateService.use(language);
            this.ctx.setLanguage(language);
            authData.setLanguage(language);
          }
        });
      }


      if( !this.ctx.getProductionApp() ) {
        translateService.use('fr');
        this.ctx.setLanguage('fr');
        authData.setLanguage('fr');
      }


    });
  }


goToHomePage(obs: any) {
  this.rootPage = HomePage;
  obs.unsubscribe();
}


goToWelcomePage(ctx: any, obs: any) {
  ctx.clear();
  this.rootPage = LoginPage;
  obs.unsubscribe();
}

goToUpdatePage(ctx: any, obs: any) {
  ctx.clear();
  this.rootPage = UpdatePage;
  obs.unsubscribe();
}


}
