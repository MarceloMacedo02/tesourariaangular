import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CobrancaAdicionarComponent } from './adicionar/cobranca-adicionar.component';

const routes: Routes = [
  {
    path: 'adicionar',
    component: CobrancaAdicionarComponent
  },
  {
    path: 'listar',
    // Componente de listagem será adicionado depois
  },
  {
    path: ':id/editar',
    // Componente de edição será adicionado depois
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobrancasRoutingModule { }