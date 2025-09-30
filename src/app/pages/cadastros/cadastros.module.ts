import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CadastrosRoutingModule } from './cadastros-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { CentroCustoFormComponent } from './centro-custo/centro-custo-form/centro-custo-form.component';
import { GrupoFinanceiroComponent } from './grupo-financeiro/grupo-financeiro.component';
import { GrupoFinanceiroFormComponent } from './grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component';
import { RubricasComponent } from './rubricas/rubricas.component';
import { GrupoMensalidadeComponent } from './grupo-mensalidade/grupo-mensalidade.component';
import { SocioListarComponent } from './socio/socio-listar/socio-listar.component';
import { SocioImportarComponent } from './socio/socio-importar/socio-importar.component';

@NgModule({
  declarations: [
    CentroCustoComponent,
    CentroCustoFormComponent,
    GrupoFinanceiroComponent,
    GrupoFinanceiroFormComponent,
    RubricasComponent,
    GrupoMensalidadeComponent,
    SocioListarComponent,
    SocioImportarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    SharedModule,
    CadastrosRoutingModule
  ]
})
export class CadastrosModule { }