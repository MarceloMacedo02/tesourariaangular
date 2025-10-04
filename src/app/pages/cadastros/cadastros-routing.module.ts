import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CentroCustoFormComponent } from './centro-custo/centro-custo-form/centro-custo-form.component';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { NonMonthlyBillingBatchComponent } from './cobrancas/batch/non-monthly-billing-batch.component';
import { BillingListComponent } from './cobrancas/billing-list.component';
import { NonMonthlyBillingIndividualComponent } from './cobrancas/individual/non-monthly-billing-individual.component';
import { SocioBillingsComponent } from './cobrancas/socio-billings/socio-billings.component';
import { FornecedorFormComponent } from './fornecedor/fornecedor-form/fornecedor-form.component';
import { FornecedorListarComponent } from './fornecedor/fornecedor-listar/fornecedor-listar.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { GrupoFinanceiroFormComponent } from './grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component';
import { GrupoFinanceiroComponent } from './grupo-financeiro/grupo-financeiro.component';
import { GrupoMensalidadeFormComponent } from './grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component';
import { GrupoMensalidadeComponent } from './grupo-mensalidade/grupo-mensalidade.component';
import { RubricasFormComponent } from './rubricas/rubricas-form/rubricas-form.component';
import { RubricasComponent } from './rubricas/rubricas.component';
import { CobrancaLoteComponent } from './socio/cobranca-lote/cobranca-lote.component';
import { SocioFormComponent } from './socio/socio-form/socio-form.component';
import { SocioImportarComponent } from './socio/socio-importar/socio-importar.component';
import { SocioListarComponent } from './socio/socio-listar/socio-listar.component';
import { SocioComponent } from './socio/socio.component';

const routes: Routes = [
  {
    path: 'centro-custo',
    redirectTo: 'centro-custo/lista',
    pathMatch: 'full',
  },
  {
    path: 'centro-custo/lista',
    component: CentroCustoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'centro-custo/novo',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'centro-custo/editar/:id',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-financeiro',
    redirectTo: 'grupo-financeiro/lista',
    pathMatch: 'full',
  },
  {
    path: 'grupo-financeiro/lista',
    component: GrupoFinanceiroComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-financeiro/novo',
    component: GrupoFinanceiroFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-financeiro/editar/:id',
    component: GrupoFinanceiroFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rubricas',
    redirectTo: 'rubricas/lista',
    pathMatch: 'full',
  },
  {
    path: 'rubricas/lista',
    component: RubricasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rubricas/novo',
    component: RubricasFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rubricas/editar/:id',
    component: RubricasFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-mensalidade',
    redirectTo: 'grupo-mensalidade/lista',
    pathMatch: 'full',
  },
  {
    path: 'grupo-mensalidade/lista',
    component: GrupoMensalidadeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-mensalidade/novo',
    component: GrupoMensalidadeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupo-mensalidade/editar/:id',
    component: GrupoMensalidadeFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'socio',
    redirectTo: 'socio/lista',
    pathMatch: 'full',
  },
  {
    path: 'socio/lista',
    component: SocioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'socio/novo',
    component: SocioFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'socio/editar/:id',
    component: SocioFormComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'fornecedores',
    children: [
      {
        path: '',
        redirectTo: 'lista',
        pathMatch: 'full',
      },
      {
        path: 'lista',
        component: FornecedorComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'novo',
        component: FornecedorFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'editar/:id',
        component: FornecedorFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'listar',
        component: FornecedorListarComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'socio',
    children: [
      {
        path: 'listar',
        component: SocioListarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'importar',
        component: SocioImportarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'gerar-cobrancas',
        component: CobrancaLoteComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'cobrancas',
    children: [
      {
        path: 'lista',
        component: BillingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'outras-rubricas-individual',
        component: NonMonthlyBillingIndividualComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'outras-rubricas-lote',
        component: NonMonthlyBillingBatchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'socio/:id',
        component: SocioBillingsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CadastrosRoutingModule {}
