import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContextProvider} from '../../providers/context/context';

import { FidapiProvider } from '../../providers/fidapi/fidapi';
import { EthapiProvider } from '../../providers/ethapi/ethapi';

/*
  Generated class for the WalletProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class WalletProvider {

  constructor(
    public http: Http,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider,
    public ethapiProvider: EthapiProvider
  ) {
    console.log('Hello WalletProvider Provider');
  }


  createGlobalEthWallet():Promise <any> {
    console.log('Open createGlobalEthWallet');
    return new Promise((resolve,reject) => {

      //Ethereum account creation
      this.createLocalEthWallet().then( (nAddress) => {
        console.log('Local wallet creation success : ', nAddress);
        this.fidapiProvider.createWallet(nAddress).then( () => {
          console.log('FidApi signup success');
          resolve();
        }, (fidApiSignupError) => {
          console.log('Signup error on Firestore database : ', fidApiSignupError);
          reject(fidApiSignupError);
        }
        );
      }, (ethAPIError) => {
        console.log('Wallet creation error : ', ethAPIError);
        reject(ethAPIError);
        });
      //End of Ethereum account creation

    });

  }

  createLocalEthWallet():Promise <any> {
    console.log('Open createLocalEthWallet');
    var ethAccount: {
      address: string,
      privateKey : string
    };

    var self = this;
    return new Promise((resolve,reject) => {
      // create Ethereum address + private key couple
      ethAccount = self.ethapiProvider.createAccount();
      console.log('Ethereum IDs created: '.concat(JSON.stringify(ethAccount)));

      self.ctx.setAddress(ethAccount.address);
      self.ctx.setPrivateKey(ethAccount.privateKey);

      // set the Ethereum IDs in the device
      self.ctx.save().then( () => {
        console.log('Ethereum IDs stored in storage');
        resolve(ethAccount.address);
      }, (ctxSaveError) => {
          console.log('Error saving EthAccount in storage');
          reject(ctxSaveError);
        }
      );

    });

  }

}
