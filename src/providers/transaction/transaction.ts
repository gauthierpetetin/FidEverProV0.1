import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ContextProvider} from '../../providers/context/context';

import { FidapiProvider } from '../../providers/fidapi/fidapi';
import { EthapiProvider } from '../../providers/ethapi/ethapi';

/*
  Generated class for the TransactionProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TransactionProvider {

  alertTitle: string = 'title';
  alertText: string = 'text';

  constructor(
    public http: Http,
    public ctx: ContextProvider,
    public fidapiProvider: FidapiProvider,
    public ethapiProvider: EthapiProvider
  ) {
    console.log('Hello TransactionProvider Provider');
  }


  sendCoins(
    toAddress: string,
    coinAmount: number,
    myAddress: string,
    myPrivateKey,
    coinContractAddress: string
  ): Promise<any> {
  console.log('Open sendCoins');

  var self = this;
  return new Promise(
    function(resolve, reject) {
      if(toAddress != null) {

        if(coinAmount > 0) {

        //-------UNCOMMENT TO SEND TOKENS------------
        self.ethapiProvider.transfer(
          coinContractAddress,
          myAddress,//fromAddress
          myPrivateKey,//fromPrivateKey
          toAddress,//toAddress
          coinAmount
        ).then( (transactionH) => {
          console.log('Coin transfer submitted successfully to Blockchain : ',transactionH);
          self.fidapiProvider.transferCoins(
            coinContractAddress,
            myAddress,//fromAddress
            toAddress,//toAddress
            coinAmount,
            transactionH
          ).then( () => {
            console.log('Coin transfer submitted successfully to Firestore : ',transactionH);
            resolve();
          }, (fidapi_error) => {
            let err = {};
            err[self.alertTitle] = 'FidApi error';
            err[self.alertText] = fidapi_error.text;
            reject(err);
          }
          );
        }, (ethapi_error) => {
          if (ethapi_error == 'INVALID') {
            let err = {};
            err[self.alertTitle] = 'Invalid recipient';
            err[self.alertText] = 'Please select a valid recipient.';
            reject(err);
          }
          else {
            let err = {};
            err[self.alertTitle] = 'EthApi error';
            err[self.alertText] = ethapi_error.text;
            reject(err);
          }
        });
        }
        else{
          let err = {};
          err[self.alertTitle] = 'Invalid coin amount';
          err[self.alertText] = 'Please select a positive amount of coins first.';
          reject(err);
        }
      }
      else{
        let err = {};
        err[self.alertTitle] = 'No recipient';
        err[self.alertText] = 'Please choose a recipient first.';
        reject(err);
      }
  });

}

}
