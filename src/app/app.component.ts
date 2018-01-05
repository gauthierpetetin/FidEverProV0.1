import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

/**************Providers************************/
import { ContextProvider} from '../providers/context/context';

/**************Modules**************************/
import { AngularFireAuth } from 'angularfire2/auth';


/**************Pages****************************/
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';



/********************FIDEVER PRO**********************************/

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    platform: Platform,
    afAuth: AngularFireAuth,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    ctx: ContextProvider
  ) {

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log('userID : ', user.uid);
        ctx.init(true, ctx.fideverProContractAddress).then( (ethAccountFound) => {
          if(ethAccountFound) {
            console.log('Context init success with Eth account');
            this.goToHomePage(authObserver);
          }
          else {
            console.log('Context init success without Eth account');
            this.goToWelcomePage(ctx, authObserver);
          }

        }, (err) => {
          console.log('Context init error : ', err);
          this.goToWelcomePage(ctx, authObserver);
        });;

      } else {
        this.goToWelcomePage(ctx, authObserver);
      }
    });

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


}
