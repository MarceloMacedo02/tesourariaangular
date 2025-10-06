import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AssociarSocioComponent } from './associar-socio.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'associar/:id',
    component: AssociarSocioComponent
  }
];

@NgModule({
  declarations: [AssociarSocioComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AssociarSocioModule { }