import { Component, OnInit } from '@angular/core';
import {canBeNumber} from '../../util/validation';
import { DappService } from '../dapp-service.service';

const Tx = require('ethereumjs-tx');
const EthUtil = require('ethereumjs-util');

@Component({
  selector: 'app-send-tokens-ether',
  templateUrl: './send-tokens-ether.component.html',
  styleUrls: ['./send-tokens-ether.component.css']
  
})
export class SendTokensEtherComponent {
  
  selectedchoices: any;
  selectedchoice: string;
  allchoices: any = [
      {choice: 'YBC'},
      {choice: 'ETH'}
  ]
  
  selectChangeHandler (event: any) {
    this.selectedchoices = event.target.value; 
    this.selectedchoice = String(this.selectedchoices);
  
    
  }

  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor( private dappservice: DappService ) {
   
  }
  ngOnInit() {
    this.dappservice.checkAndInstantiateWeb3();
    this.dappservice.onReady();
    
  }
  sendYBCEther() {
    if(this.selectedchoice == "YBC")
    {
        this.sendCoin();
    }
    else{
      this.sendEther();
    }
    
  }
  
  sendEther(){
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;

    this.dappservice.web3.eth.sendTransaction({
      from: this.dappservice.account,
      to: receiver,
      value: this.dappservice.web3.toWei(amount, "ether")
    })
    this.dappservice.setStatus("Transaction Complete");
    this.dappservice.refreshBalance();
  }
  

  sendCoin() {
    
    const amount = this.sendingAmount;
    const receiver = this.recipientAddress;
    let yubi;

    this.dappservice.setStatus('Initiating transaction... (please wait)');

    this.dappservice.YubiCoin.deployed()
      .then((instance) => {
        yubi = instance;
       var contractabi = yubi.abi;
       console.log("abi: "+contractabi);
       var contractaddress = yubi.address; 
       console.log("contract address: "+yubi.address);
       var ethcontract = this.dappservice.web3.eth.contract(contractabi).at(contractaddress);
       
       var noncevalue = this.dappservice.web3.eth.getTransactionCount(this.dappservice.account);
       console.log("nonce : "+ noncevalue);

       var mydata = this.dappservice.web3.sha3('transfer(address,uint)');
       console.log("mydata: "+mydata)
       var mydatahex = mydata.substr(0,10);
       console.log("My data: "+mydata);
       var mydata_2 = ethcontract.transfer.getData(receiver, amount, {from: this.dappservice.account});
       console.log("mYdata2: "+mydata_2);
      

       var rawTx = {
        "from": this.dappservice.account,
        "nonce": this.dappservice.web3.toHex(noncevalue),
        "gasPrice": this.dappservice.web3.toHex(this.dappservice.web3.eth.gasPrice),
        "gasLimit":this.dappservice.web3.toHex(300000),
        "to": contractaddress,
        "value": 0,
        "data": mydata_2
         };

        console.log(rawTx);

         //hard coded private key of the coin base account  for testing purpose
       
        var privateKeybuff =new Buffer('d852add137400c59c03c0f64f07ea9a115778003c3552885247716fa4aa90ae0', 'hex');       
        
        var tx = new Tx(rawTx);
        console.log("tx: "+tx);
        tx.sign(privateKeybuff);
        if (tx.verifySignature()) {
        console.log('Signature Checks out!' + tx);
        }

        var serializedTx = tx.serialize();
        console.log("Serializetx:" +"0x"+serializedTx.toString('hex'));
        var rawtxn = "0x"+serializedTx.toString('hex');

        
        this.dappservice.web3.eth.sendRawTransaction(rawtxn, function(err, hash) {
          if (!err){
        // Log the tx, you can explore status manually with eth.getTransaction()
            console.log('contract creation tx: ' + hash);            
          }
          else    
          {
            console.log(err);
          }       
        });


      })
      .then(() => {
        this.dappservice.setStatus('Transaction complete!');
        this.dappservice.refreshBalance();
      })
      .catch((e) => {
        console.log(e);
        this.dappservice.setStatus('Error sending coin; see log.');
      });
  }
}
