/*!
 * EthApi
 * Copyright(c) 2017 Raphaël Pralat
 * MIT Licensed
 */
import { Injectable } from '@angular/core'
import * as Web3 from 'web3'
//import Web3 from 'web3';
import * as Tx from 'ethereumjs-tx'

import 'rxjs/add/observable/throw'
//import { Observable } from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx'

declare const Buffer

@Injectable()
export class EthapiProvider {

  web3: any;
  account: any;
  node: string = "http://fidever.io:8545";
  contractAddress: string = "0xbe5c6930b754df6dc6a7a7f17f12180335e7bc75";

  //hairCoin: any

  constructor() {
    console.log('Open ethapi constructor');

    this.web3 = new Web3()

    console.log('Close ethapi constructor')

  }


  dial() { /****************METHOD TO BE SECURED****************/
    // if(!this.web3.currentProvider) {
    //   console.log("dial off");
    //   this.web3.setProvider(new this.web3.providers.HttpProvider(this.node));
    //   //console.log("dial ok : ", this.web3);
    // }
    // else {
    //   console.log("dial on");
    // }
    // console.log("end dial");

    if (typeof this.web3 !== 'undefined') {
      console.log('Open dial current');
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.log('Open dial new');
      //this.web3 = new Web3(new Web3.providers.HttpProvider(this.node));
      this.web3 = new Web3(new Web3.HttpProvider(this.node));
    }

  }

  // Create Ethereum address
  createAccount() : any {
    console.log('Open createAccount : ',this.web3);
    this.dial();
    console.log('Open createAccount2 : ',this.web3);
    // Create address
    this.account = this.web3.eth.accounts.create();
    //this.account = this.web3.personal.newAccount('the-passphrase');
    //this.account = this.web3.eth.accounts.create('entropy');
    //console.log(this.account);
    //this.account = this.web3.eth.personal.newAccount();
    console.log("New account created");
    console.log(this.account);
    return this.account;

  }

  getBalances(address) {
    this.dial()
    return new Promise((resolve, reject) => {
      //var self = this;
      console.log("Call Contract: " + this.contractAddress)
      // var web3 = this.web3;

      // Contract data
      var SimpleStorageABI = '[{"constant":true,"inputs":[],"name":"getHair","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setPizza","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPizza","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"}],"name":"setHair","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
      var abi = JSON.parse(SimpleStorageABI);



      // Call contract
      var myContract = new this.web3.eth.Contract(abi, this.contractAddress);

      myContract.methods.getHair().call().then(
        function(result){
        console.log("Result Hair=> " + result)
        //self.hairCoin = result
        var test = [
          {
            code: 'hair',
            title: 'Hair coins',
            balance: result,
          }
        ]
        console.log("return")
        resolve(test)
      })

      myContract.methods.getPizza().call().then(
        function(result){
        console.log("Result Pizza => " + result)
      })

    })
  }

  // isAddress(address : string) {
  //   // check if it has the basic requirements of an address
  //   if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
  //       return false;
  //       // If it's ALL lowercase or ALL upppercase
  //   } else if (/^(0x|0X)?[0-9a-f]{40}$/.test(address) || /^(0x|0X)?[0-9A-F]{40}$/.test(address)) {
  //       return true;
  //       // Otherwise check each case
  //   } else {
  //       return this.checkAddressChecksum(address);
  //   }
  // }
  //
  // checkAddressChecksum(address : string) {
  //   // Check each case
  //   address = address.replace(/^0x/i,'');
  //   var addressHash = sha3(address.toLowerCase()).replace(/^0x/i,'');
  //
  //   for (var i = 0; i < 40; i++ ) {
  //       // the nth letter should be uppercase if the nth digit of casemap is 1
  //       if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
  //           return false;
  //       }
  //   }
  //   return true;
  // }

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
      //var self = this;
      console.log("code to get")

      console.log("Unlock");
      var web3 = this.web3;

      // Account data
      // var account_address = "0x35c41D5f7c31831be6C7bE20373C14647201Deb8";
      // var account_secret = "ae10b8fb12a30aa26c904b940205670b36f8ac62f00f830b88c9e3a44928fef4";

      var account_address = fromAddress
      var account_secret = fromPrivateKey.substring(2,fromPrivateKey.length)
      // var account_secret = "e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109";
      console.log('account_secret: ',account_secret)
      var privateKey = Buffer.from(account_secret, 'hex')
      //console.log('private key: ',privateKey)

      // Contract data
      var SimpleStorageABI = '[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]';
      var abi = JSON.parse(SimpleStorageABI);

      // Exec contract
      var contract = new web3.eth.Contract(abi, contractAddress, {
        from: account_address, // default from address
        gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });
      //contract.options.address("0x9f6a26efb0d33adb48e16cac453058f1c5b0b131");

      console.log("contract.options => ");
      console.log(contract.options);

      // Construct the raw transaction
      const gasPrice = web3.eth.getGasPrice();
      console.log("gasPrice =>" + gasPrice);

      //const gasPriceHex = web3.utils.toHex(gasPrice);
      const gasLimitHex = web3.utils.toHex(300000);

      web3.eth.getTransactionCount(account_address).then( (nonce) => {
        console.log("Nonce =>" + nonce);
        // const nonceHex = web3.utils.toHex(nonce);
        const nonceHex = web3.utils.toHex(nonce);

        console.log('Amount of tokens to send : ',amount)

        if(web3.utils.isAddress(toAddress)) {
          console.log('Valid Ethereum address')

          var transferVar = contract.methods.transfer(toAddress, amount)
          console.log('Post-transferVar : ', transferVar);
          // var estimateGas = web3.eth.estimateGas({}, (gasAmount) => {
          // //var estimateGas = transferVar.estimateGas({gas: 5000000}, (gasAmount) => {
          //   //contract.methods.transfer(toAddress, tokenAmount).estimateGas({gas: 5000000}, function(error, gasAmount){
          //   console.log("gasAmount => " + gasAmount);
          // }, (estimateGasError) => {
          //   console.log('estimateGas Error : ', estimateGasError)
          //   reject(estimateGasError)
          // })

            //var contractAbi = contract.methods.transfer(toAddress, tokenAmount).encodeABI()
            var contractAbi = transferVar.encodeABI()
            console.log("contract.options.address => " + contract.options.address)
            console.log("contractAbi => " + contractAbi)

            const rawTx = {
              nonce: nonceHex,
              //nonce: '0x00',
              gasPrice: '0x000000000001',
              gasLimit: gasLimitHex,
              data: contractAbi,
              value: '0x00',
              from: account_address,
              to: contractAddress
            }

            console.log("rawTx => ",rawTx)

            // Sign and serialize the transaction
            console.log("sign raw transaction with privatekey: ", privateKey)
            const tx = new Tx(rawTx)
            tx.sign(privateKey)
            const serializedTx = tx.serialize()
            console.log("Raw transaction ready to be sent: ", "0x" + serializedTx.toString('hex'))

            // Send the transaction
            web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'))
              .on('transactionHash', (hash) => {
                console.log('TransactionHash =>', hash)
                //PREVENIR FIDAPI
                resolve(hash);
              })
              .on('receipt', (receipt) => {
                console.log('Receipt =>', receipt)
              })
              .on('confirmation', function(confirmationNumber, receipt){
                console.log('Confirmation =>', confirmationNumber)
              })
              .on('error', (sendSignedTransactionError) => {
                console.log('sendSignedTransactionError : ',sendSignedTransactionError)
                reject(sendSignedTransactionError)
            })


        }
        else {
          console.log('Invalid Ethereum address')
          reject('INVALID')
        }


      },(nonceError) => {
        console.log('nonceError: ',nonceError)
        reject(nonceError)
      })

    })
  }
}
