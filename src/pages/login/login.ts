import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

import { ContextProvider} from '../../providers/context/context';
import { WalletProvider} from '../../providers/wallet/wallet';

//
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { ResetPasswordPage } from '../reset-password/reset-password';

import { TranslateService } from '@ngx-translate/core';

import {Md5} from 'ts-md5/dist/md5';

/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm:FormGroup;
  public loading:Loading;

  info : string;

  emailPlaceholder: string;
  passwordPlaceholder: string;

  constructor(
    public navCtrl: NavController,
    public authData: AuthProvider,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public ctx: ContextProvider,
    public walletProvider: WalletProvider,
    private translateService: TranslateService
  ) {

      console.log('Login Page constructor');

      this.info = this.ctx.info;

      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

      this.translate();

    }

    translate() {
      this.translateService.get('LOGIN.EMAIL.PLACEHOLDER').subscribe(emailPlaceholder => { this.emailPlaceholder = emailPlaceholder.toString(); });
      this.translateService.get('LOGIN.PASSWORD.PLACEHOLDER').subscribe(passwordPlaceholder => { this.passwordPlaceholder = passwordPlaceholder.toString(); });
    }

    loginUser(){
      if (!this.loginForm.valid){
        console.log(this.loginForm.value);
      }
      else {
        let loginEmail: string = this.loginForm.value.email;
        let hashPassword: string = Md5.hashStr(this.loginForm.value.password).toString();

        this.authData.loginUser(loginEmail, hashPassword)
        .then( (user) => {
          console.log('Firebase login success : ', user.uid);
          this.walletProvider.createGlobalEthWallet(user.uid, user.email, user.displayName, user.profilePicture, hashPassword).then( () => {
            this.navCtrl.insert(0,HomePage);
            this.navCtrl.popToRoot();
            this.ctx.init(user.uid, user.email, user.displayName, user.photoURL, true, false, true, this.ctx.fideverProContractAddress);
          }, (globalWalletError) => {
            this.loading.dismiss().then( () => {
              var errorMessage: string = "Error ".concat(globalWalletError);
                let alert = this.alertCtrl.create({
                  message: errorMessage,
                  buttons: [
                    {
                      text: "Ok",
                      role: 'cancel'
                    }
                  ]
                });
                alert.present();
            });
          });

        }, authenticationError => {
          this.loading.dismiss().then( () => {
            var errorMessage: string = "Error ".concat(authenticationError);
              let alert = this.alertCtrl.create({
                message: errorMessage,
                buttons: [
                  {
                    text: "Ok",
                    role: 'cancel'
                  }
                ]
              });
              alert.present();
          });
        });

        this.loading = this.loadingCtrl.create({
          dismissOnPageChange: true,
        });
        this.loading.present();
      }

      //   this.ctx.c[this.info]['email']=this.loginForm.value.email;
      //   this.ctx.save();
      //   this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      //   .then( authData => {
      //     this.walletProvider.createGlobalEthWallet().then( () => {
      //       //this.navCtrl.setRoot(HomePage);
      //       this.navCtrl.insert(0,HomePage);
      //       this.navCtrl.popToRoot();
      //       this.ctx.init(true, this.ctx.fideverProContractAddress);
      //     });
      //
      //   }, error => {
      //     this.loading.dismiss().then( () => {
      //       let alert = this.alertCtrl.create({
      //         message: error.message,
      //         buttons: [
      //           {
      //             text: "Ok",
      //             role: 'cancel'
      //           }
      //         ]
      //       });
      //       alert.present();
      //     });
      //   });
      //
      //   this.loading = this.loadingCtrl.create({
      //     dismissOnPageChange: true,
      //   });
      //   this.loading.present();
      // }
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }

  createAccount(){
    this.navCtrl.push(SignupPage);
  }

}
