import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  template: `
  <h1 class="title">YubiCoin</h1>
  <nav>
    <a routerLink="/viewwalletinfo" routerLinkActive="active">View Wallet Info</a>
    <a routerLink="/send-tokens-ether" routerLinkActive="active">Send Tokens/Ether</a>
  </nav>
  <router-outlet></router-outlet>
  `
  
})

export class AppComponent {

}