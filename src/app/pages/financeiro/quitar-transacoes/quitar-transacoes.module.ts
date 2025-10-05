import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuitarTransacoesComponent } from './quitar-transacoes.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: QuitarTransacoesComponent
  }
];

@NgModule({
  declarations: [QuitarTransacoesComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class QuitarTransacoesModule { }