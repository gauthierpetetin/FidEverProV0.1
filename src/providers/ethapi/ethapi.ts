/*!
 * EthApi
 * Copyright(c) 2017 Raphaël Pralat
 * MIT Licensed
 */
import { Injectable } from '@angular/core'
import * as Web3 from 'web3'
import * as Tx from 'ethereumjs-tx'

import 'rxjs/add/observable/throw'
import { Observable } from 'rxjs/Rx'

declare const Buffer

@Injectable()
export class EthapiProvider {

  web3: any;
  account: any;
  node: string = "http://fidever.io:8545";
  contractAddress: string = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75";


  constructor() {
    console.log('Open ethapi constructor');

    this.web3 = new Web3();

    this.dial();

    console.log('Close ethapi constructor : ', this.web3);

  }


  dial() { /****************METHOD TO BE SECURED****************/
    console.log("Open dial");
    if(!this.web3.currentProvider) {
      console.log("dial off");
      this.web3.setProvider(new this.web3.providers.HttpProvider(this.node));
    }
    else {
      console.log("dial on");
    }
    console.log("Close dial : ", this.web3);

    // if (typeof this.web3 !== 'undefined') {
    //   console.log('Open dial current');
    //   this.web3 = new Web3(this.web3.currentProvider);
    // } else {
    //   console.log('Open dial new');
    //   //this.web3 = new Web3(new Web3.providers.HttpProvider(this.node));
    //   this.web3 = new Web3(new Web3.HttpProvider(this.node));
    // }

  }

  // Create Ethereum address
  createAccount() {
    console.log("Open createAccount");
    var Accounts = require('web3-eth-accounts');
    var ethAccount = new Accounts(this.node).create();
    //console.log("new account created: " + test.address)
    //console.log("new account created: " + test.privateKey)
    console.log("Close createAccount : ",ethAccount.address);
    return ethAccount;
  }

  transfer (
    contractAddress : string,
    fromAddress : string,
    fromPrivateKey : string,
    toAddress : string,
    amount : number
  ): Promise<any> {

    console.log('contractAddress: ', contractAddress)
    console.log('fromAddress: ', fromAddress)
    console.log('fromPrivateKey: ',fromPrivateKey)
    console.log('toAddress: ', toAddress)
    console.log('amount: ', amount)

    this.dial()

    return new Promise((resolve, reject) => {

      var web3 = this.web3;
      console.log("Transfer with web3 : ",web3);

      // Account data
      var account_address = fromAddress
      var account_secret = fromPrivateKey.substring(2,fromPrivateKey.length)
      var privateKey = Buffer.from(account_secret, 'hex')
      //console.log('private key: ',privateKey)

      // Contract data
      var SimpleStorageABI = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]';
      var abi = JSON.parse(SimpleStorageABI);

      console.log('Exec contract');
      // Exec contract
      var contract = web3.eth.contract(abi);
      console.log('Contract : ',contract);
      //var contractInstance = contract.at(account_address);
      var contractInstance = contract.at(this.contractAddress);
      console.log('Contract instance : ',contractInstance);

      web3.eth.getGasPrice(function(gasPriceError, result){ // Useless here since we decided to set gasprice to minimum to reduce account fueling requirements
        if(gasPriceError) {
          console.log('getGasPrice error : ', gasPriceError);
          reject(gasPriceError);
        }
        else{
          var gasPrice = result;
          console.log('getGasPrice success : ', gasPrice);

          if(web3.isAddress(toAddress)) {
            console.log('Valid Ethereum address');

            web3.eth.getTransactionCount(account_address, function(nonceError, nonce) {
              if (nonceError) {
                console.log("Nonce error : ", nonceError);
                reject(nonceError);
              }
              else {
                console.log("Nonce success : ", nonce);
                const nonceHex = web3.toHex(nonce);
                console.log("Nonce hex : ", nonce);

                var contractCallData = contractInstance.transfer.getData(toAddress, amount);
                console.log('contractCallData : ', contractCallData);

                const gasLimitHex = web3.toHex(300000);

                const rawTx = {
                  nonce: nonceHex,
                  gasPrice: '0x000000000001',
                  gasLimit: gasLimitHex,
                  data: contractCallData,
                  value: '0x00',
                  from: account_address,
                  to: contractAddress
                };

                console.log("Raw Transaction: ",rawTx);

                // Sign and serialize the transaction
                console.log("Sign raw transaction with privatekey: ", privateKey);
                const tx = new Tx(rawTx);
                tx.sign(privateKey);
                const serializedTx = tx.serialize();
                console.log("Raw transaction ready to be sent: ", "0x" + serializedTx.toString('hex'));

                web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(sendError, transactionHash) {
                  if (sendError) {
                    console.log('sendRawTransaction error : ', sendError);
                    reject(sendError);
                  }
                  else {
                    console.log('sendRawTransaction success : ',transactionHash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                    resolve(transactionHash);
                  }
                });

              }
            }); // End of "getTransactionCount" (getNonce)

          }
          else{
            console.log('Invalid Ethereum address')
            reject('INVALID');
          }

        }
      }); // End of "getGasPrice"

    }); // End of "new Promise"
  }


  // getBalances(address) {
  //   this.dial()
  //   return new Promise((resolve, reject) => {
  //     //var self = this;
  //     console.log("Call Contract: " + this.contractAddress)
  //     // var web3 = this.web3;
  //
  //     // Contract data
  //     var SimpleStorageABI = '[{"constant":true,"inputs":[],"name":"getHair","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setPizza","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPizza","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setHair","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
  //     var abi = JSON.parse(SimpleStorageABI);
  //
  //
  //
  //     // Call contract
  //     var myContract = new this.web3.eth.Contract(abi, this.contractAddress);
  //
  //     myContract.methods.getHair().call().then(
  //       function(result){
  //       console.log("Result Hair=> " + result)
  //       //self.hairCoin = result
  //       var test = [
  //         {
  //           code: 'hair',
  //           title: 'Hair coins',
  //           balance: result,
  //         }
  //       ]
  //       console.log("return")
  //       resolve(test)
  //     })
  //
  //     myContract.methods.getPizza().call().then(
  //       function(result){
  //       console.log("Result Pizza => " + result)
  //     })
  //
  //   })
  // }

}
