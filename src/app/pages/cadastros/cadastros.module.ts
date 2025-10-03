import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { NonMonthlyBillingIndividualComponent } from './cobrancas/individual/non-monthly-billing-individual.component';
import { NonMonthlyBillingBatchComponent } from './cobrancas/batch/non-monthly-billing-batch.component';
import { BillingListComponent } from './cobrancas/billing-list.component';
import { SocioBillingsComponent } from './cobrancas/socio-billings/socio-billings.component';
import { FornecedorModule } from './fornecedor/fornecedor.module';

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
    CobrancaLoteComponent,
    NonMonthlyBillingIndividualComponent,
    NonMonthlyBillingBatchComponent,
    BillingListComponent,
    SocioBillingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxCurrencyDirective,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    SharedModule,
    CadastrosRoutingModule,
    FornecedorModule
  ],
  providers: [
    CurrencyPipe,
    DatePipe
  ]
})
export class CadastrosModule { }