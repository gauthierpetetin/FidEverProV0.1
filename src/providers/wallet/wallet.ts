import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContextProvider} from '../../providers/context/context';

import { FidapiProvider } from '../../providers/fidapi/fidapi';
import { EthapiProvider } from '../../providers/ethapi/ethapi';

import {Md5} from 'ts-md5/dist/md5';

/*
  Generated class for the WalletProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export interface Wallet {
  address: string,
  privateKey: string
};


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

  createGlobalEthWallet(uid: string, email: string, displayName: string, photoURL: string, hashPassword: string):Promise <any> {
    var self = this;
    return new Promise((resolve,reject) => {
      if(self.ctx.cordovaPlatform) {
        self.createGlobalEthWallet_PROD(uid, email, displayName, photoURL, hashPassword).then((res)=>{resolve(res)}).catch((err)=>{reject(err)});
      }
      else {
        self.createGlobalEthWallet_DELETE(uid, email, displayName, photoURL, hashPassword).then((res)=>{resolve(res)}).catch((err)=>{reject(err)});
      }
      // self.createGlobalEthWallet_PROD(uid, email, displayName, photoURL, hashPassword).then((res)=>{resolve(res)}).catch((err)=>{reject(err)});
    });
  }

  createGlobalEthWallet_PROD(uid: string, email: string, displayName: string, photoURL: string, hashPassword: string):Promise <any> {
    console.log('Open createGlobalEthWallet');
    let ethAccount: Wallet;

    let passPhrase = Md5.hashStr(uid.concat(hashPassword)).toString();

    var self = this;
    return new Promise((resolve,reject) => {

      self.ctx.init(uid, email, displayName, photoURL, false, false, false).then( () => {
        console.log('Init config success');

        //Ethereum account creation
        ethAccount = self.ethapiProvider.createAccount(passPhrase);

        self.fidapiProvider.createWallet(uid, ethAccount.address).then( () => {
          console.log('FidApi signup success');
          self.ctx.setHashPassword(hashPassword);
          self.ctx.setAddress(ethAccount.address);
          self.ctx.setPrivateKey(ethAccount.privateKey);

          self.ctx.save().then( () => {
            resolve();
          }).catch( (saveError) => {
            console.log('Context save error');
            reject(saveError);
          });
        }, (fidApiSignupError) => {
          console.log('Error : fidapiProvider.createWallet');
          reject(fidApiSignupError);
        });

        //End of Ethereum account creation

      }).catch( (err) => {
        console.log('createGlobalEthWallet init error: ', err.text);
        reject(err);
      });

    });

  }

  createGlobalEthWallet_DELETE(uid: string, email: string, displayName: string, photoURL: string, hashPassword: string):Promise <any> {
    console.log('Open createGlobalEthWallet');

    let passPhrase = Md5.hashStr(uid.concat(hashPassword)).toString();

    var self = this;
    return new Promise((resolve,reject) => {

      self.ctx.init(uid, email, displayName, photoURL, false, false, false).then( () => {
        console.log('Init config success');

        //Ethereum account creation
        self.createLocalEthWallet_DELETE(passPhrase).then( (nAddress) => {
          console.log('Local wallet creation success : ', nAddress);
          self.fidapiProvider.createWallet(uid, nAddress).then( () => {
            console.log('FidApi signup success');
            self.ctx.setHashPassword(hashPassword);
            self.ctx.save().then( () => {
              resolve();
            }).catch( (saveError) => {
              console.log('Context save error');
              reject(saveError);
            });
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

      }).catch( (err) => {
        console.log('createGlobalEthWallet init error: ', err.text);
        reject(err);
      });

    });

  }

  createLocalEthWallet_DELETE(passPhrase: string):Promise <any> {
    console.log('Open createLocalEthWallet');
    var ethAccount: Wallet;

    var self = this;
    return new Promise((resolve,reject) => {
      // create Ethereum address + private key couple
      ethAccount = self.ethapiProvider.createAccount(passPhrase);
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
