import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

import { WalletinfoComponent }    from './walletinfo.component';
import { AccountDetailsComponent }    from './accountdetails.component';
import { WalletRoutingModule } from './walletinfo-routing.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WalletRoutingModule
  ],
  declarations: [
    WalletinfoComponent,
    AccountDetailsComponent
    
  ],
 
})
export class WalletInfoModule {}