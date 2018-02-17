import { Component } from '@angular/core';
import { App, NavController, NavParams, AlertController, ModalController} from 'ionic-angular';

import { LoginPage } from '../login/login';
import { SendCoinsPage } from '../send-coins/send-coins';

import { AuthProvider } from '../../providers/auth/auth';
import { ContextProvider } from '../../providers/context/context';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {


  coinName: string;
  coinColor: string = "#fe9400";
  coinIcon: string;

  company: string;

  navbarID: string = "colorNavbar";

  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public ctx: ContextProvider,
    private barcodeScanner: BarcodeScanner,
    public alertCtrl: AlertController,
    private translateService: TranslateService
  ){
    this.coinName = this.ctx.getCoinName(this.ctx.fideverProContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.ctx.fideverProContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.ctx.fideverProContractAddress);

    this.translate();

  }

  translate() {

  }

  distributeCoins() {
    var self = this;
    if( this.ctx.cordovaPlatform ) {
      this.scanCode().then( (toAddress) => {
        if ( toAddress ) {
          self.sendCoins(toAddress);
        }
      });
    }
    else {
      console.log('Please use a cordova platform to launch barcode scanner.');
      /******DELETE*******/
      // self.sendCoins('');
      /*******************/
    }
  }

  sendCoins(toAddress: string) {
    // this.navCtrl.push(SendCoinsPage, {
    //   amount: 1,
    //   to: toAddress
    // });
    this.modalCtrl.create(SendCoinsPage, {
      amount: 1,
      to: toAddress
    }).present();
  }

  scanCode(): Promise<any> {
    var self = this;
    return new Promise(
      function(resolve, reject) {
        self.barcodeScanner.scan({
          preferFrontCamera: true,
          prompt: 'Scan your ID to receive FIDs',
          orientation: 'landscape'
        }).then(barcodeData => {
          // let alert = self.alertCtrl.create({
          //   message: barcodeData.text,
          //   buttons: [{
          //     text: "Ok",
          //     role: 'cancel'
          //   }]
          // });
          // alert.present();
          resolve(barcodeData.text);
        }).catch( (error) => { reject(error); });
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
