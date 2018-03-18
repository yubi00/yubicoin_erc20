import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-wallet',
  templateUrl: './new-wallet.component.html',
  styleUrls: ['./new-wallet.component.css']
})
export class NewWalletComponent implements OnInit {
  passcode: string;
  privatekey: any;

  constructor() { }

  ngOnInit() {
  }

  newWallet() {

  }

}
