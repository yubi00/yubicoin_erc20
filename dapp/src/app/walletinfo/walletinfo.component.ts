import { Component, OnInit } from '@angular/core';
var keythereum = require("keythereum");
var EthUtil = require('ethereumjs-util');
const Web3 = require('web3');

@Component({
  selector: 'app-walletinfo',
  templateUrl: './walletinfo.component.html',
  styleUrls: ['./walletinfo.component.css']
})
export class WalletinfoComponent implements OnInit {

  privatekey: any;
  web3: any;
  contractaddress: any;
  totalsupply: number;
  tokenbalance: number;
  etherbalance: number; 
  ethereumaddress: any;

  constructor() { }

  ngOnInit() {
  }
 
  generateAddress() {
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
