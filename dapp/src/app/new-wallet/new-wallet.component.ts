import { Component, OnInit } from '@angular/core';
var EthUtil = require('ethereumjs-util');
const Web3 = require('web3');

@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {
  passcode: string;
  privatekey: any;
  web3: any;
  ethereumaddress: any; 

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
   }

  ngOnInit() {
  }

  newWallet() {
    this.privatekey = (this.web3.sha3(this.passcode)).substr(2);
    console.log("Private Key: "+this.privatekey);
    
    this.ethereumaddress = this.privateKeyToAddress(this.privatekey);
    console.log("Generated ethereum address: "+this.ethereumaddress);
  }

  hexToBytes(hex: any){
    for (var bytes = [], c = 0; c < hex.length; c+=2)
	  bytes.push(parseInt((hex.toString()).substr(c, 2), 16));
	  return bytes;
  }

  privateKeyToAddress(privateKey: any){
    
	    return `0x${EthUtil.privateToAddress(this.hexToBytes(privateKey)).toString('hex')}`;

  }

}
