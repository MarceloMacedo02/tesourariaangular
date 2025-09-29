import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { CentroCustoFormComponent } from './centro-custo/centro-custo-form/centro-custo-form.component';
import { GrupoFinanceiroComponent } from './grupo-financeiro/grupo-financeiro.component';
import { RubricasComponent } from './rubricas/rubricas.component';
import { GrupoMensalidadeComponent } from './grupo-mensalidade/grupo-mensalidade.component';
import { SocioListarComponent } from './socio/socio-listar/socio-listar.component';
import { SocioImportarComponent } from './socio/socio-importar/socio-importar.component';

const routes: Routes = [
  {
    path: 'centro-custo',
    redirectTo: 'centro-custo/lista',
    pathMatch: 'full'
  },
  {
    path: 'centro-custo/lista',
    component: CentroCustoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'centro-custo/novo',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'centro-custo/editar/:id',
    component: CentroCustoFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grupo-financeiro',
    component: GrupoFinanceiroComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'rubricas',
    component: RubricasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'grupo-mensalidade',
    component: GrupoMensalidadeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'socio',
    children: [
      {
        path: 'listar',
        component: SocioListarComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'importar',
        component: SocioImportarComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastrosRoutingModule { }