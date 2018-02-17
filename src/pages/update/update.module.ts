import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePage } from './update';


/**************Modules**************************/
import { IonicImageLoader } from 'ionic-image-loader';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    UpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(UpdatePage),
    IonicImageLoader,
    TranslateModule.forChild()
  ],
  exports: [
    UpdatePage
  ]
})
export class UpdatePageModule {}
