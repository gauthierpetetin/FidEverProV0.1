import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController } from 'ionic-angular';

/*
  Generated class for the AlertProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AlertProvider {

  constructor(
    public http: Http,
    public alertCtrl: AlertController
  ) {

    console.log('Hello AlertProvider Provider');

  }


  receiveAlert(delta : number, name : string) {
    console.log('Open receiveAlert : ',delta.toString());
    let alert = this.alertCtrl.create({
      title: '+'.concat(delta.toString(),' ',name,'s!'),
      subTitle: 'Congratulations, you just received '.concat(delta.toString(),' ',name,'s.'),
      buttons: ['OK']
    });
    alert.present();
    console.log('Close receiveAlert');
  }

  sendAlert(delta : number, name : string) {
    console.log('Open sendAlert : ',delta.toString());
    let alert = this.alertCtrl.create({
      title: '-'.concat(delta.toString(),' ',name,'s'),
      subTitle: 'Your '.concat(delta.toString(),' ',name,'s were sent successfully.'),
      buttons: ['OK']
    });
    alert.present();
    console.log('Close sendAlert');
  }


}
