import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CobrancasAvulsasDetalhesComponent } from './cobrancas-avulsas/cobrancas-avulsas-detalhes.component';
import { CobrancasAvulsasFormComponent } from './cobrancas-avulsas/cobrancas-avulsas-form.component';
import { CobrancasAvulsasListarComponent } from './cobrancas-avulsas/cobrancas-avulsas-listar.component';
import { CobrancasAvulsasPagamentoComponent } from './cobrancas-avulsas/cobrancas-avulsas-pagamento.component';
import { ContasPagarDetalhesComponent } from './contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarFormComponent } from './contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarListarComponent } from './contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarPagamentoComponent } from './contas-a-pagar/contas-a-pagar-pagamento.component';
import { ContasAReceberDetalhesComponent } from './contas-a-receber/contas-a-receber-detalhes.component';
import { ContasAReceberFormComponent } from './contas-a-receber/contas-a-receber-form.component';
import { ContasAReceberListarComponent } from './contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberPagamentoComponent } from './contas-a-receber/contas-a-receber-pagamento.component';
import { UploadOfxComponent } from './upload-ofx/upload-ofx.component';

import { AssociarSocioComponent } from './associar-socio/associar-socio.component';
import { DespesasComponent } from './despesas/despesas.component';
import { ReceitasComponent } from './receitas/receitas.component';
import { ReviewTransacoesComponent } from './review-transacoes/review-transacoes.component';
import { TransacoesPendentesDetalhesComponent } from './transacoes-pendentes/transacoes-pendentes-detalhes.component';
import { TransacoesPendentesComponent } from './transacoes-pendentes/transacoes-pendentes.component';
import { TransacoesCreditoComponent } from './transacoes-credito/transacoes-credito.component';
import { TransacoesDebitoComponent } from './transacoes-debito/transacoes-debito.component';
import { BaixaTransacaoComponent } from './baixa-transacao/baixa-transacao.component';

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
    path: 'transacoes-pendentes',
    children: [
      {
        path: '',
        component: TransacoesPendentesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'detalhes/:id',
        component: TransacoesPendentesDetalhesComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'receitas',
    component: ReceitasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'despesas',
    component: DespesasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'review-transacoes',
    component: ReviewTransacoesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'associar-socio/:id',
    component: AssociarSocioComponent,
    canActivate: [AuthGuard],
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
        component: TransacoesCreditoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'debito',
        component: TransacoesDebitoComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'baixa/:id',
        component: BaixaTransacaoComponent,
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
