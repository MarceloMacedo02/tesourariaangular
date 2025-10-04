import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { CadastrosRoutingModule } from './cadastros-routing.module';
import { CentroCustoFormComponent } from './centro-custo/centro-custo-form/centro-custo-form.component';
import { CentroCustoComponent } from './centro-custo/centro-custo.component';
import { NonMonthlyBillingBatchComponent } from './cobrancas/batch/non-monthly-billing-batch.component';
import { BillingListComponent } from './cobrancas/billing-list.component';
import { NonMonthlyBillingIndividualComponent } from './cobrancas/individual/non-monthly-billing-individual.component';
import { SocioBillingsModule } from './cobrancas/socio-billings/socio-billings.module';
import { FornecedorFormComponent } from './fornecedor/fornecedor-form/fornecedor-form.component';
import { FornecedorListarComponent } from './fornecedor/fornecedor-listar/fornecedor-listar.component';
import { FornecedorComponent } from './fornecedor/fornecedor.component';
import { GrupoFinanceiroFormComponent } from './grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component';
import { GrupoFinanceiroComponent } from './grupo-financeiro/grupo-financeiro.component';
import { GrupoMensalidadeFormComponent } from './grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component';
import { GrupoMensalidadeComponent } from './grupo-mensalidade/grupo-mensalidade.component';
import { RubricasFormComponent } from './rubricas/rubricas-form/rubricas-form.component';
import { RubricasComponent } from './rubricas/rubricas.component';
import { CobrancaLoteComponent } from './socio/cobranca-lote/cobranca-lote.component';
import { SocioFormComponent } from './socio/socio-form/socio-form.component';
import { SocioImportarComponent } from './socio/socio-importar/socio-importar.component';
import { SocioListarComponent } from './socio/socio-listar/socio-listar.component';
import { SocioComponent } from './socio/socio.component';

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
    FornecedorComponent,
    FornecedorFormComponent,
    FornecedorListarComponent,
    SocioComponent,
    SocioFormComponent,
    SocioListarComponent,
    SocioImportarComponent,
    CobrancaLoteComponent,
    NonMonthlyBillingIndividualComponent,
    NonMonthlyBillingBatchComponent,
    BillingListComponent,
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
    SocioBillingsModule,
  ],
  providers: [CurrencyPipe, DatePipe],
})
export class CadastrosModule {}
