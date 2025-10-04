import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SocioBillingsComponent } from './socio-billings.component';
import { NonMonthlyBillingService } from '../non-monthly-billing.service';
import { SocioService } from '../../socio/socio.service';

@NgModule({
  declarations: [
    SocioBillingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule
  ],
  exports: [
    SocioBillingsComponent
  ],
  providers: [
    NonMonthlyBillingService,
    SocioService
  ]
})
export class SocioBillingsModule { }