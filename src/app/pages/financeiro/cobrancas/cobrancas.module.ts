import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CobrancaAdicionarComponent } from './adicionar/cobranca-adicionar.component';
import { CobrancasRoutingModule } from './cobrancas-routing.module';

@NgModule({
  declarations: [
    CobrancaAdicionarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CobrancasRoutingModule
  ]
})
export class CobrancasModule { }