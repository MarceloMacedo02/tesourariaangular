import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ContasPagarListarComponent } from './contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarFormComponent } from './contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarDetalhesComponent } from './contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarPagamentoComponent } from './contas-a-pagar/contas-a-pagar-pagamento.component';
import { CobrancasAvulsasListarComponent } from './cobrancas-avulsas/cobrancas-avulsas-listar.component';
import { CobrancasAvulsasFormComponent } from './cobrancas-avulsas/cobrancas-avulsas-form.component';
import { CobrancasAvulsasDetalhesComponent } from './cobrancas-avulsas/cobrancas-avulsas-detalhes.component';
import { CobrancasAvulsasPagamentoComponent } from './cobrancas-avulsas/cobrancas-avulsas-pagamento.component';
import { ContasAReceberListarComponent } from './contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberFormComponent } from './contas-a-receber/contas-a-receber-form.component';

const routes: Routes = [
  {
    path: 'contas-a-pagar',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        component: ContasPagarListarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'novo',
        component: ContasPagarFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editar/:id',
        component: ContasPagarFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'detalhes/:id',
        component: ContasPagarDetalhesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pagamento/:id',
        component: ContasPagarPagamentoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'cobrancas-avulsas',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        component: CobrancasAvulsasListarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'novo',
        component: CobrancasAvulsasFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editar/:id',
        component: CobrancasAvulsasFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'detalhes/:id',
        component: CobrancasAvulsasDetalhesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pagamento/:id',
        component: CobrancasAvulsasPagamentoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'contas-a-receber',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        component: ContasAReceberListarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'novo',
        component: ContasAReceberFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editar/:id',
        component: ContasAReceberFormComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // Outras funcionalidades financeiras serão adicionadas conforme desenvolvimento
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinanceiroRoutingModule {}