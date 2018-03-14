import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WalletinfoComponent }    from './walletinfo.component';
import { AccountDetailsComponent }    from './accountdetails.component';

const WalletInfoRoutes: Routes = [
  { path: 'viewwalletinfo',  component: WalletinfoComponent },
  { path: 'accountdetails',  component: AccountDetailsComponent },
  
];

@NgModule({
  imports: [
    RouterModule.forChild(WalletInfoRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WalletRoutingModule { }