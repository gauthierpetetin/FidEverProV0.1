import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AlertController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';


/*
  Generated class for the AlertProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

@Injectable()
export class AlertProvider {

  receiveAlertContent: string;

  constructor(
    public http: Http,
    public alertCtrl: AlertController,
    private translateService: TranslateService
  ) {

    console.log('Hello AlertProvider Provider');

  }

  // translate() { /------------- Ne marche pas ---------------------/
  //   this.translateService.get('ALERT.RECEIVECONTENT').subscribe(receiveAlertContent => { this.receiveAlertContent = receiveAlertContent.toString(); });
  // }

  receiveAlert(delta : number, name : string, language?: string) {
    if ( language == 'fr' ) {
      this.receiveAlertContent = "Félicitations, tu viens de recevoir";
    }
    else {
      this.receiveAlertContent = "Congratulations, you just received";
    }

    console.log('Open receiveAlert : ',delta.toString());
    let alert = this.alertCtrl.create({
      title: '+'.concat(delta.toString(),' ',name,'!'),
      subTitle: this.receiveAlertContent.concat(' ', delta.toString(), ' ', name,'.'),
      buttons: ['OK']
    });
    alert.present();
    console.log('Close receiveAlert');
  }

  sendAlert(delta : number, name : string) {
    console.log('Open sendAlert : ',delta.toString());
    let alert = this.alertCtrl.create({
      title: '-'.concat(delta.toString(),' ',name,),
      subTitle: 'Your '.concat(delta.toString(),' ',name,'s were sent successfully.'),
      buttons: ['OK']
    });
    alert.present();
    console.log('Close sendAlert');
  }


}
