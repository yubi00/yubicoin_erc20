import {Component} from '@angular/core';
import {canBeNumber} from '../util/validation';

const Web3 = require('web3');
const contract = require('truffle-contract');
const yubicoinArtifacts = require('../../build/contracts/YubiCoin.json');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  YubiCoin = contract(yubicoinArtifacts);

  account: any;
  accounts: any;
  web3: any;

  balance: number;
  totalsupply: number; 
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor() {
    this.checkAndInstantiateWeb3();
    this.onReady();
  }

  checkAndInstantiateWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/aaMask)
    if (typeof this.web3 !== 'undefined') {
      console.warn('Using web3 detected from external source. If you find that your accounts don\'t appear or you have ' +
        '0 YubiCoin, ensure you\'ve configured that source properly. If using MetaMask, see the following link. Feel ' +
        'free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask');
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      console.warn('No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when ' +
        'you deploy live, as it\'s inherently insecure. Consider switching to Metamask for development. More info ' +
        'here: http://truffleframework.com/tutorials/truffle-and-metamask');
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }
  }

  onReady() {
    // Bootstrap the YubiCoin abstraction for Use.
    this.YubiCoin.setProvider(this.web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert('There was an error fetching your accounts.');
        return;
      }

      if (accs.length === 0) {
        alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }
      this.accounts = accs;
      this.account = this.accounts[0];

      this.initialSupply();
    });
  }

  initialSupply() {
    let yubi;
    this.YubiCoin.deployed()
      .then((instance) => {
        yubi = instance;
        return yubi.totalSupply.call();
      })
      .then((value) => {
        this.totalsupply = value.toString(10);
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }

  refreshBalance() {
    let yubi;
    this.YubiCoin.deployed()
      .then((instance) => {
        yubi = instance;
        return yubi.balanceOf.call(this.account, {
          from: this.account
        });
      })
      .then((value) => {
        this.balance = value;
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }



  setStatus(message: string) {
    this.status = message;
  }

  sendCoin() {
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let yubi;

    this.setStatus('Initiating transaction... (please wait)');

    this.YubiCoin.deployed()
      .then((instance) => {
        yubi = instance;
       var contractabi = yubi.abi;
       console.log("abi: "+contractabi);
       var contractaddress = yubi.address; 
       console.log("contract address: "+yubi.address);
       var coinbase = '0x45aB33Ae8Ce087dee888191963785c09A5468f83';
       console.log("coinbase acoount :"+coinbase);

       

      })
      .then(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error sending coin; see log.');
      });
  }
}