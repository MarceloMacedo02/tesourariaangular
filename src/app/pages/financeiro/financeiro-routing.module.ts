import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { DashboardFinanceiroComponent } from './dashboard-financeiro/dashboard-financeiro.component';
import { ContasPagarComponent } from './contas-pagar/contas-pagar.component';
import { ContasPagarFormComponent } from './contas-pagar/contas-pagar-form/contas-pagar-form.component';
import { ContasReceberComponent } from './contas-receber/contas-receber.component';
import { ContasReceberFormComponent } from './contas-receber/contas-receber-form/contas-receber-form.component';
import { RelatoriosFinanceirosComponent } from './relatorios-financeiros/relatorios-financeiros.component';
import { ContaDetalhesComponent } from './conta-detalhes/conta-detalhes.component';
import { ImportarContasPagarComponent } from './importar-contas-pagar/importar-contas-pagar.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardFinanceiroComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-pagar',
    redirectTo: 'contas-pagar/lista',
    pathMatch: 'full'
  },
  {
    path: 'contas-pagar/lista',
    component: ContasPagarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-pagar/novo',
    component: ContasPagarFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-pagar/editar/:id',
    component: ContasPagarFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-pagar/detalhes/:id',
    component: ContaDetalhesComponent,
    canActivate: [AuthGuard],
    data: { tipo: 'pagar' }
  },
  {
    path: 'contas-pagar/importar',
    component: ImportarContasPagarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-receber',
    redirectTo: 'contas-receber/lista',
    pathMatch: 'full'
  },
  {
    path: 'contas-receber/lista',
    component: ContasReceberComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-receber/novo',
    component: ContasReceberFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-receber/editar/:id',
    component: ContasReceberFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'contas-receber/detalhes/:id',
    component: ContaDetalhesComponent,
    canActivate: [AuthGuard],
    data: { tipo: 'receber' }
  },
  {
    path: 'relatorios',
    component: RelatoriosFinanceirosComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceiroRoutingModule { }