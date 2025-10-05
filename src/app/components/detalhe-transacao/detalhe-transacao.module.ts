import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetalheTransacaoComponent } from '../detalhe-transacao/detalhe-transacao.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: DetalheTransacaoComponent
  }
];

@NgModule({
  declarations: [DetalheTransacaoComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class DetalheTransacaoModule { }