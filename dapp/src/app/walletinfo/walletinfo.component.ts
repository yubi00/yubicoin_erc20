import { Component, OnInit } from '@angular/core';
var keythereum = require("keythereum");

@Component({
  selector: 'app-walletinfo',
  templateUrl: './walletinfo.component.html',
  styleUrls: ['./walletinfo.component.css']
})
export class WalletinfoComponent implements OnInit {

  privatekey: any;
  account: any;
  accounts: any;
  web3: any;
  contractaddress: any;
  totalsupply: number;
  totaltokens: number;
  etherbalance: number; 
  selectedfiles: any;
  keystorefile : File;

  constructor() { }

  ngOnInit() {
  }
 
  fileChange(event: any) {
    let files: FileList = event.target.files;
        this.keystorefile = files[0];
        console.log(this.keystorefile);

  }

  getPrivateKey(filelocation: any,  contract_address: any, password: any) {
    var keyobject = keythereum.importFromFile(contract_address, filelocation);
    console.log(keyobject);

    this.privatekey = keythereum.recover(password, keyobject);
    console.log((this.privatekey).toString('hex'));
  }
}
