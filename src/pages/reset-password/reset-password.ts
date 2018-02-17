import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm:FormGroup;

  emailPlaceholder: string;
  resetMessage: string;

  constructor(
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public nav: NavController,
    public alertCtrl: AlertController,
    private translateService: TranslateService
  ) {

    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    });

    this.translate();

  }

  translate() {
    this.translateService.get('RESET_PASSWORD.EMAIL.PLACEHOLDER').subscribe(emailPlaceholder => { this.emailPlaceholder = emailPlaceholder.toString(); });
    this.translateService.get('RESET_PASSWORD.MESSAGE').subscribe(resetMessage => { this.resetMessage = resetMessage.toString(); });
  }


  /**
   * If the form is valid it will call the AuthData service to reset the user's password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  resetPassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authData.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
        let alert = this.alertCtrl.create({
          message: this.resetMessage,
          buttons: [
            {
              text: "Ok",
              role: 'cancel',
              handler: () => {
                this.nav.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        errorAlert.present();
      });
    }
  }
}
