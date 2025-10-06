import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ContasAReceberListarComponent } from './contas-a-receber-listar.component';
import { ContasAReceberFormComponent } from './contas-a-receber-form.component';
import { ContasAReceberDetalhesComponent } from './contas-a-receber-detalhes.component';
import { ContasAReceberPagamentoComponent } from './contas-a-receber-pagamento.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full',
  },
  {
    path: 'lista',
    component: ContasAReceberListarComponent
  },
  {
    path: 'novo',
    component: ContasAReceberFormComponent
  },
  {
    path: 'editar/:id',
    component: ContasAReceberFormComponent
  },
  {
    path: 'detalhes/:id',
    component: ContasAReceberDetalhesComponent
  },
  {
    path: 'pagamento/:id',
    component: ContasAReceberPagamentoComponent
  }
];

@NgModule({
  declarations: [
    ContasAReceberListarComponent,
    ContasAReceberFormComponent,
    ContasAReceberDetalhesComponent,
    ContasAReceberPagamentoComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContasAReceberModule { }