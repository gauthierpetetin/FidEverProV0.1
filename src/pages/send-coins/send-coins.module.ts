import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendCoinsPage } from './send-coins';

/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    SendCoinsPage,
  ],
  imports: [
    IonicPageModule.forChild(SendCoinsPage),
    IonicImageLoader
  ],
  exports: [
    SendCoinsPage
  ]
})
export class SendCoinsPageModule {}
