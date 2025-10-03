import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FornecedorComponent } from './fornecedor.component';

const routes: Routes = [
  {
    path: '',
    component: FornecedorComponent,
    data: {
      title: 'Fornecedores' // Título da rota para breadcrumbs ou título da página
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorRoutingModule { }