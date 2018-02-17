import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { ContextProvider} from '../../providers/context/context';
/**
 * Generated class for the UpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update',
  templateUrl: 'update.html',
})
export class UpdatePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public ctx: ContextProvider
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UpdatePage');
  }


  updateApp() {
    console.log('Update !');
    window.open(this.ctx.getConfigAppDownloadUrl(), '_system', 'location=yes');
  }

}
