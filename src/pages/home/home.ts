import { Component, ViewChild, ElementRef } from '@angular/core';
import { App, NavController, NavParams, AlertController} from 'ionic-angular';

import { LoginPage } from '../login/login';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider } from '../../providers/context/context';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  coinContractAddress: string = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75";
  coinName: string;
  coinColor: string = "#fe9400";
  coinIcon: string;

  company: string;

  navbarID: string = "colorNavbar";

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController
  ){
    this.coinName = this.ctx.getCoinName(this.coinContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.coinContractAddress);
    this.company = this.ctx.getCompanyName(this.coinContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.coinContractAddress);
    if( document.getElementById(this.navbarID) ) {
      document.getElementById(this.navbarID).style.backgroundColor = this.coinColor;
    }
  }


  ionViewDidLoad() {
    document.getElementById(this.navbarID).style.backgroundColor = this.coinColor;
  }

  distributeCoins() {
    this.scanCode();
  }

  scanCode() {
    var self = this;
    this.barcodeScanner.scan().then(barcodeData => {
      //********INSERT COIN TRANSACTION HERE*******************
      //this.scannedCode = barcodeData.text;
      let alert = self.alertCtrl.create({
        message: barcodeData.text,
        buttons: [{
          text: "Ok",
          role: 'cancel'
        }]
      });
      alert.present();

    });
  }

  logOut(): void {
    console.log('Open logOut');
    this.authProvider.logoutUser().then(() => {
      this.appCtrl.getRootNav().setRoot(LoginPage);
    });
    console.log('Close logOut');
  }

}
