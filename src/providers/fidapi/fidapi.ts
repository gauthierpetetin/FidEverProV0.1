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

  proxyURL: string = '';
  apiURL: string;

  idToken: string;

  authenticateURL: string = 'auth';
  createWalletURL: string = 'wallet';
  transferURL: string = 'transfer';
  demoCoinsURL: string = 'debug/supply';

  requestAnswer: Observable<any>;

  requestCounter: number = 0;

  constructor(
    public http: Http
  ) {
    console.log('Hello FidapiProvider Provider');

  }

  setProxyUrl(proxyUrl: string) {
    this.proxyURL = proxyUrl;
  }

  setApiUrl(apiUrl: string) {
    this.apiURL = apiUrl;
  }

  logOut() {
    this.idToken = null;
  }


  authenticate(uid: string) : Promise<any> {
    console.log('Open FidApi - authenticate : ', uid);
    var self = this;
    var counter = self.requestCounter;
    self.requestCounter +=1;

    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'uid' : uid
      });
      var postHeaders = new Headers({
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        // 'Access-Control-Allow-Header': 'Content-Type,x-prototype-version,x-requested-with',
        'Content-Type': 'application/json'
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      var postUrl: string = self.proxyURL.concat(self.apiURL, self.authenticateURL);
      self.requestAnswer = self.http.post(
        // self.apiURL.concat(self.authenticateURL),
        postUrl,
        postContent,
        postOptions
      );
      console.log('POST', counter,' request (fidapi) at URL : ', postUrl, ' with content : ', postContent);
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('POST', counter,' request (fidapi) success : authenticate ', JSON.stringify(data) );
          self.idToken = data['token'];
          resolve(data);
        },
        err => {
          console.log('POST', counter,' request (fidapi) error : authenticate ', JSON.stringify(err) );
          reject(err);
        });
    });
  }

  createWallet(uid: string, myAddress : string) : Promise<any> {
    console.log('Open FidApi - createWallet : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.createWallet_real(myAddress).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.createWallet_real(myAddress).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  createWallet_real(myAddress : string) : Promise<any> {
    console.log('Open FidApi - createWallet_real : ', myAddress, 'with idToken: ', this.idToken);
    var self = this;

    var counter = self.requestCounter;
    self.requestCounter +=1;

    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'address' : myAddress
      });
      var postHeaders = new Headers({
        // 'Access-Control-Allow-Origin': '*',
        // 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        // 'Access-Control-Allow-Header': 'Content-Type,x-prototype-version,x-requested-with',
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      var postUrl: string = self.proxyURL.concat(self.apiURL, self.createWalletURL);
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.createWalletURL),
        postContent,
        postOptions
      );
      console.log('POST', counter,' request (fidapi) at URL : ', postUrl, ' with content : ', postContent);
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('POST', counter,' request (fidapi) success : wallet ', JSON.stringify(data) );
          resolve(data);
        },
        err => {
          console.log('POST', counter,' request (fidapi) error : wallet ', JSON.stringify(err) );
          reject(err);
        });
    });
  }

  transferCoins(
    uid: string,
    coinContractAddress : string,
    fromAddress : string,
    toAddress : string,
    amount : number,
    transaction : any
  ): Promise<any> {
    console.log('Open FidApi - transferCoins : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.transferCoins_real(
          coinContractAddress,
          fromAddress,
          toAddress,
          amount,
          transaction
        ).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.transferCoins_real(
            coinContractAddress,
            fromAddress,
            toAddress,
            amount,
            transaction
          ).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  transferCoins_real(
    coinContractAddress : string,
    fromAddress : string,
    toAddress : string,
    amount : number,
    transaction : any
  ): Promise<any> {

    console.log('Open FidApi - transferCoins_real with idToken: ', this.idToken);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = {
        'token' : coinContractAddress,
        'from' : fromAddress,
        'to' : toAddress,
        'amount' : parseInt(amount.toString()),
        'transaction' : transaction
      };
      var postHeaders = new Headers({
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      var postOptions = new RequestOptions({ headers: postHeaders });
      var postUrl: string = self.proxyURL.concat(self.apiURL, self.transferURL);
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.transferURL),
        postContent,
        postOptions
      );
      console.log('POST request (fidapi) at URL : ', postUrl, ' with content : ', postContent);
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          //console.log('FidAPI transferred coins: ', JSON.stringify(data) );
          //console.log('Close transferCoins');
          resolve(data);
        },
        err => {
          //console.log('FidAPI failed transfering coins',err);
          //console.log('Close transferCoins');
          reject(err);
        });
    });
  }

  getDemoCoins(uid: string) : Promise<any> {
    console.log('Open FidApi - getDemoCoins : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.getDemoCoins_real(uid).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.getDemoCoins_real(uid).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  getDemoCoins_real(uid : string) : Promise<any> {
    console.log('Open FidApi - getDemoCoins_real: ', uid, 'with idToken: ', this.idToken);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'uid' : uid
      });
      var postHeaders = new Headers({
        // 'Access-Control-Allow-Origin': 'http://localhost:8100/',
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      console.log('Headers : ', postHeaders);
      var postOptions = new RequestOptions({ headers: postHeaders });
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.demoCoinsURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI got demo coins: ', JSON.stringify(data) );
          resolve(data);
        },
        err => {
          console.log('FidAPI failed getting demo coins',err);
          reject(err);
        });
    });
  }

  rewardClaim(uid: string, coinContractAddress : string, offerID: string, transactionHash : string) : Promise<any> {
    console.log('Open FidApi - rewardClaim : ', offerID, 'with transactionHash : ', transactionHash);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.rewardClaim_real(coinContractAddress, offerID, transactionHash).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.rewardClaim_real(coinContractAddress, offerID, transactionHash).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  rewardClaim_real(coinContractAddress : string, offerID: string, transactionHash : string) : Promise<any> {
    console.log('Open FidApi - rewardClaim_real : ', offerID, ' and transactionHash: ', transactionHash);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'token' :	coinContractAddress,
        'offer_id' :	offerID,
        'txhash' :	transactionHash
      });
      var postHeaders = new Headers({
        // 'Access-Control-Allow-Origin': 'http://localhost:8100/',
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      console.log('Headers : ', postHeaders);
      var postOptions = new RequestOptions({ headers: postHeaders });
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.createWalletURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI claimed reward: ', JSON.stringify(data) );
          resolve(data);
        },
        err => {
          console.log('FidAPI failed claiming reward',err);
          reject(err);
        });
    });
  }


  rewardRedeem(uid: string, coinContractAddress : string, offerID: string, transactionHash : string) : Promise<any> {
    console.log('Open FidApi - rewardRedeem : ', uid);
    var self = this;
    return new Promise((resolve, reject) => {
      if(self.idToken) {
        self.rewardRedeem_real(coinContractAddress, offerID, transactionHash).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
      }
      else {
        self.authenticate(uid).then((res) => {
          self.rewardRedeem_real(coinContractAddress, offerID, transactionHash).then((res) => {resolve(res);}).catch((err)=>{reject(err);});
        }).catch((err)=>{reject(err);});
      }
    });
  }

  rewardRedeem_real(coinContractAddress : string, offerID: string, transactionHash : string) : Promise<any> {
    console.log('Open FidApi - rewardRedeem_real : ', offerID, ' and transactionHash: ', transactionHash);
    var self = this;
    return new Promise((resolve, reject) => {
      var postContent = JSON.stringify({
        'token' :	coinContractAddress,
        'offer_id' :	offerID,
        'txhash' :	transactionHash
      });
      var postHeaders = new Headers({
        // 'Access-Control-Allow-Origin': 'http://localhost:8100/',
        'Content-Type': 'application/json',
        'x-token': self.idToken
      });
      console.log('Headers : ', postHeaders);
      var postOptions = new RequestOptions({ headers: postHeaders });
      self.requestAnswer = self.http.post(
        self.proxyURL.concat(self.apiURL, self.createWalletURL),
        postContent,
        postOptions
      );
      self.requestAnswer
        .map(res => res.json())
        .subscribe(data => {
          console.log('FidAPI redeemed reward: ', JSON.stringify(data) );
          resolve(data);
        },
        err => {
          console.log('FidAPI failed redeeming reward',err);
          reject(err);
        });
    });
  }


}
