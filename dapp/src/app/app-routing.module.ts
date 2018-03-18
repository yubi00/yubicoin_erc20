import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';
import { SendTokensEtherComponent } from './send-tokens-ether/send-tokens-ether.component';
import { NewWalletComponent } from './new-wallet/new-wallet.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
    { path: '',   redirectTo: '/new-wallet', pathMatch: 'full' },
    { path: 'send-tokens-ether', component: SendTokensEtherComponent },
    { path: 'new-wallet', component: NewWalletComponent },
    { path: '**', component: PageNotFoundComponent }
       
  ];

  @NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
        { enableTracing: true } 
      )
    ],
    exports: [
      RouterModule
    ]
  })
  export class AppRoutingModule {}