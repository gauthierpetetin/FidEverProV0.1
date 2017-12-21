import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

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
    private statusBar: StatusBar
  ) {

    const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log('Authenticated user : '.concat(JSON.stringify(user)));
        this.rootPage = HomePage;
        console.log('HomePage as rootPage');
        authObserver.unsubscribe();
      } else {
        //this.rootPage = 'LoginPage';
        this.rootPage = LoginPage;
        console.log('LoginPage as rootPage');
        authObserver.unsubscribe();
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //statusBar.styleDefault();
      //statusBar.backgroundColorByHexString('#fe9400');
      //statusBar.hide();

      splashScreen.hide();
    });
  }
}
