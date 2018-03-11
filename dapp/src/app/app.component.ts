import {Component} from '@angular/core';
import {canBeNumber} from '../util/validation';

const Web3 = require('web3');
const contract = require('truffle-contract');
const Tx = require('ethereumjs-tx');
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
  etherbalance:number;
  ethaccount: string;
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
      this.refreshBalance();
      this.etherbalance = this.web3.fromWei(this.web3.eth.getBalance(this.account));
      
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
        this.totalsupply = this.web3.fromWei(value, 'ether').toNumber();
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
        this.balance = this.web3.fromWei(value, 'ether').toNumber();
        console.log("token balance: "+this.balance);
      })
      .catch((e) => {
        console.log(e);
        this.setStatus('Error getting balance; see log.');
      });
  }

  setStatus(message: string) {
    this.status = message;
  }

  waitForTransactionReceipt(hash: string)
  {
    console.log('waiting for contract to be mined');
    const receipt = this.web3.eth.getTransactionReceipt(hash);
    // If no receipt, try again in 1s
    if (receipt == null) {
        setTimeout(() => {
            this.waitForTransactionReceipt(hash);
        }, 1000);
    } else {
        // The transaction was mined, we can retrieve the contract address
        console.log(receipt);
        
        console.log('Transaction hash: '+receipt.transactionHash);
        console.log('contract address: ' + receipt.contractAddress);
       
    }
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
       var ethcontract = this.web3.eth.contract(contractabi).at(contractaddress);
       
       var noncevalue = this.web3.eth.getTransactionCount(this.account);
       console.log("nonce : "+ noncevalue);

       var mydata = this.web3.sha3('transfer(address,uint)');
       var mydatahex = mydata.substr(0,10);
       console.log("My data: "+mydata); 
       var mydata_2 = ethcontract.transfer.getData(receiver, amount, {from: this.account});
       console.log("mYdata2: "+mydata_2);

       var rawTx = {
        "from": this.account,
        "nonce": this.web3.toHex(noncevalue),
        "gasPrice": this.web3.toHex(this.web3.eth.gasPrice),
        "gasLimit":this.web3.toHex(300000),
        "to": receiver,
        "value": 0,
        "data": mydatahex
         };

        console.log(rawTx);


        
        var privateKeybuff = new Buffer('6cf3addcb9f44801dfd55813cd278b6470f99137a4a8d43b04dd09f9bbf3c2df', 'hex');

        
        var tx = new Tx(rawTx);
        console.log("tx: "+tx);
        tx.sign(privateKeybuff);
        if (tx.verifySignature()) {
        console.log('Signature Checks out!' + tx);
        }

        var serializedTx = tx.serialize();
        console.log("Serializetx:" +"0x"+serializedTx.toString('hex'));
        var rawtxn = "0x"+serializedTx.toString('hex');

        
        this.web3.eth.sendRawTransaction(rawtxn, function(err, hash) {
          if (!err){
        // Log the tx, you can explore status manually with eth.getTransaction()
            console.log('contract creation tx: ' + hash);
        
            // Wait for the transaction to be mined
            this.waitForTransactionReceipt(hash);
          }
          else    
          {
            console.log(err);
          }       
        });


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