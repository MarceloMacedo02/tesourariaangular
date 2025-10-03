import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CadastrosRoutingModule } from './cadastros-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { CentroCustoFormComponent } from './centro-custo/centro-custo-form/centro-custo-form.component';
import { GrupoFinanceiroComponent } from './grupo-financeiro/grupo-financeiro.component';
import { GrupoFinanceiroFormComponent } from './grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component';
import { RubricasComponent } from './rubricas/rubricas.component';
import { RubricasFormComponent } from './rubricas/rubricas-form/rubricas-form.component';
import { GrupoMensalidadeComponent } from './grupo-mensalidade/grupo-mensalidade.component';
import { GrupoMensalidadeFormComponent } from './grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component';
import { SocioComponent } from './socio/socio.component';
import { SocioFormComponent } from './socio/socio-form/socio-form.component';
import { SocioListarComponent } from './socio/socio-listar/socio-listar.component';
import { SocioImportarComponent } from './socio/socio-importar/socio-importar.component';
import { CobrancaLoteComponent } from './socio/cobranca-lote/cobranca-lote.component';

@NgModule({
  declarations: [
    CentroCustoComponent,
    CentroCustoFormComponent,
    GrupoFinanceiroComponent,
    GrupoFinanceiroFormComponent,
    RubricasComponent,
    RubricasFormComponent,
    GrupoMensalidadeComponent,
    GrupoMensalidadeFormComponent,
    SocioComponent,
    SocioFormComponent,
    SocioListarComponent,
    SocioImportarComponent,
    CobrancaLoteComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    CadastrosRoutingModule
  ]
})
export class CadastrosModule { }