import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

import { QuitacaoCreditoComponent } from './quitacao-credito.component';

const routes: Routes = [
  {
    path: '',
    component: QuitacaoCreditoComponent
  }
];

@NgModule({
  declarations: [
    QuitacaoCreditoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class QuitacaoCreditoModule { }