import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the FidapiProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FidapiProvider {

  proxyURL: string = 'https://cors-anywhere.herokuapp.com/';
  apiURL: string = 'http://fidever.io:8080/';
  createWalletURL : string = 'wallet';
  transferURL : string = 'transfer';
  requestAnswer: Observable<any>;

  constructor(
    public http: Http
  ) {
    console.log('Hello FidapiProvider Provider');
  }

  createWallet(myAddress : string) : Promise<any> {
    console.log('Open createWallet : ', myAddress);
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'address' : myAddress
      });
      var postHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      this.requestAnswer = this.http.post(
        this.proxyURL.concat(this.apiURL, this.createWalletURL),
        postContent,
        postOptions
      );
      this.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI created wallet: ', JSON.stringify(data) );
          console.log('Close createWallet');
          resolve();
        },
        err => {
          console.log('FidAPI failed creating wallet',err);
          console.log('Close createWallet');
          reject();
        });
    });
  }

  //-------UNCOMMENT TO SEND TOKENS------------
  // this.ethapiProvider.transfer(
  //   this.coinContract,
  //   fromAddress,
  //   fromPrivateKey,
  //   this.scannedCode
  // );

  transferCoins(
    coinContractAddress : string,
    fromAddress : string,
    toAddress : string,
    amount : number,
    transaction : any
  ): Promise<any> {

    console.log('Open transferCoins');
    return new Promise((resolve, reject) => {
      var postContent = {
        'token' : coinContractAddress,
        'from' : fromAddress,
        'to' : toAddress,
        'amount' : parseInt(amount.toString()),
        'transaction' : transaction
      };
      var postHeaders = new Headers({
        'Content-Type': 'application/json'
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      console.log('TransferCoins on fidAPI with postContent : ', postContent, ' and postHeaders : ', postHeaders, ' and postOptions : ',postOptions);
      this.requestAnswer = this.http.post(
        this.proxyURL.concat(this.apiURL, this.transferURL),
        postContent,
        postOptions
      );
      this.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI transferred coins: ', JSON.stringify(data) );
          console.log('Close transferCoins');
          resolve();
        },
        err => {
          console.log('FidAPI failed transfering coins',err);
          console.log('Close transferCoins');
          reject();
        });
    });
  }

}
