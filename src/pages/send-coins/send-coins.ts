import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';

import { ImageLoaderConfig, ImageLoader } from 'ionic-image-loader';

import { EthapiProvider } from '../../providers/ethapi/ethapi';
import { ContextProvider} from '../../providers/context/context';
import { FidapiProvider} from '../../providers/fidapi/fidapi';
import { TransactionProvider} from '../../providers/transaction/transaction';

/**
 * Generated class for the SendCoinsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-coins',
  templateUrl: 'send-coins.html',
})
export class SendCoinsPage {

  public loading:Loading;

  toAddress: string;

  coinName: string;
  coinColor: string;
  coinIcon: string;
  coinAmount: number;

  transactionSubmitted : boolean;

  alertTitle: string;
  alertText: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public ethapiProvider: EthapiProvider,
    public loadingCtrl: LoadingController,
    private imageLoaderConfig: ImageLoaderConfig,
    public imageLoader: ImageLoader,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider,
    public transactionProvider: TransactionProvider
  ) {
    this.imageLoaderConfig.enableSpinner(true);

    this.toAddress = navParams.get('to');
    this.coinAmount = navParams.get('amount');
    this.coinName = this.ctx.getCoinName(this.ctx.fideverProContractAddress);
    this.coinColor = this.ctx.getCoinColor(this.ctx.fideverProContractAddress);
    this.coinIcon = this.ctx.getCoinIcon(this.ctx.fideverProContractAddress);

    this.transactionSubmitted = false;
    this.alertTitle = this.transactionProvider.alertTitle;
    this.alertText = this.transactionProvider.alertText;

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
    this.transactionProvider.sendCoins(
      this.toAddress,
      this.coinAmount,
      this.ctx.getAddress(),
      this.ctx.getPrivateKey(),
      this.ctx.fideverProContractAddress
    ).then( () => {
      this.loading.dismiss();
      this.transactionSubmitted = true;
      this.toAddress = null;
    }).catch( (error) => {
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        title: error[this.alertTitle],
        subTitle: error[this.alertText],
        buttons: ['OK']
      });
      alert.present();
    });

  // this.toAddress = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75";
  // this.coinAmount = 1;
  // this.transactionSubmitted = true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendCoinsPage');
  }


goBack() {
  this.navCtrl.pop();
}

}
