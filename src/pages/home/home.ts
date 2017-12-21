import { Component } from '@angular/core';
import { App, NavController, NavParams} from 'ionic-angular';

import { LoginPage } from '../login/login';

import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider
  ){}



  logOut(): void {
    console.log('Open logOut');
    this.authProvider.logoutUser().then(() => {
      this.appCtrl.getRootNav().setRoot(LoginPage);
    });
    console.log('Close logOut');
  }

}
