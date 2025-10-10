import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ContasPagarDetalhesComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarFormComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarListarComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarPagamentoComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-pagamento.component';
import { ContasAReceberDetalhesComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-detalhes.component';
import { ContasAReceberFormComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-form.component';
import { ContasAReceberListarComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberPagamentoComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-pagamento.component';
import { UploadOfxComponent } from './upload-ofx/upload-ofx.component';

import { ReviewTransacoesComponent } from './transasoes/review-transacoes/review-transacoes.component';
import { TransacoesCreditoEditarComponent } from './transasoes/transacoes-credito/transacoes-credito-editar/transacoes-credito-editar.component';
import { TransacoesCreditoComponent } from './transasoes/transacoes-credito/transacoes-credito.component';
import { TransacoesDebitoComponent } from './transasoes/transacoes-debito/transacoes-debito.component';

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
      {
        path: 'detalhes/:id',
        component: ContasAReceberDetalhesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pagamento/:id',
        component: ContasAReceberPagamentoComponent,
        canActivate: [AuthGuard],
      },
    ],
  },

  {
    path: 'upload-ofx',
    component: UploadOfxComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'transacoes',
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: ReviewTransacoesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'credito',
        children: [
          {
            path: '',
            redirectTo: 'listar',
            pathMatch: 'full',
          },
          {
            path: 'listar',
            component: TransacoesCreditoComponent,
            canActivate: [AuthGuard],
          },
          {
            path: 'baixar/:id',
            component: TransacoesCreditoEditarComponent,
            canActivate: [AuthGuard],
          },
        ],
      },
      {
        path: 'debito',
        component: TransacoesDebitoComponent,
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
