import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransacoesPendentesComponent } from './transacoes-pendentes.component';
import { TransacoesPendentesDetalhesComponent } from './transacoes-pendentes-detalhes.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: TransacoesPendentesComponent
  },
  {
    path: 'detalhes/:id',
    component: TransacoesPendentesDetalhesComponent
  }
];

@NgModule({
  declarations: [
    TransacoesPendentesComponent,
    TransacoesPendentesDetalhesComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TransacoesPendentesModule { }