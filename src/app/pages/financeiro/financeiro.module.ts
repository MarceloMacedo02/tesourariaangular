import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedModule } from 'src/app/shared/shared.module';
import { FinanceiroRoutingModule } from './financeiro-routing.module';

import { DashboardFinanceiroComponent } from './dashboard-financeiro/dashboard-financeiro.component';
import { ContasPagarComponent } from './contas-pagar/contas-pagar.component';
import { ContasPagarFormComponent } from './contas-pagar/contas-pagar-form/contas-pagar-form.component';
import { ContasReceberComponent } from './contas-receber/contas-receber.component';
import { ContasReceberFormComponent } from './contas-receber/contas-receber-form/contas-receber-form.component';
import { QuitarContaModalComponent } from './quitar-conta-modal/quitar-conta-modal.component';
import { ContaDetalhesComponent } from './conta-detalhes/conta-detalhes.component';
import { RelatoriosFinanceirosComponent } from './relatorios-financeiros/relatorios-financeiros.component';
import { ImportarContasPagarComponent } from './importar-contas-pagar/importar-contas-pagar.component';

@NgModule({
  declarations: [
    DashboardFinanceiroComponent,
    ContasPagarComponent,
    ContasPagarFormComponent,
    ContasReceberComponent,
    ContasReceberFormComponent,
    QuitarContaModalComponent,
    ContaDetalhesComponent,
    RelatoriosFinanceirosComponent,
    ImportarContasPagarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    MatDialogModule,
    SharedModule,
    FinanceiroRoutingModule
  ],
  providers: []
})
export class FinanceiroModule { }