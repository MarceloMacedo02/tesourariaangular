import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CobrancasAvulsasDetalhesComponent } from './cobrancas-avulsas/cobrancas-avulsas-detalhes.component';
import { CobrancasAvulsasFormComponent } from './cobrancas-avulsas/cobrancas-avulsas-form.component';
import { CobrancasAvulsasListarComponent } from './cobrancas-avulsas/cobrancas-avulsas-listar.component';
import { CobrancasAvulsasPagamentoComponent } from './cobrancas-avulsas/cobrancas-avulsas-pagamento.component';
import { ContasPagarDetalhesComponent } from './contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarFormComponent } from './contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarListarComponent } from './contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarPagamentoComponent } from './contas-a-pagar/contas-a-pagar-pagamento.component';
import { ContasAReceberDetalhesComponent } from './contas-a-receber/contas-a-receber-detalhes.component';
import { ContasAReceberFormComponent } from './contas-a-receber/contas-a-receber-form.component';
import { ContasAReceberListarComponent } from './contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberPagamentoComponent } from './contas-a-receber/contas-a-receber-pagamento.component';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { UploadOfxComponent } from './upload-ofx/upload-ofx.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssociarSocioComponent } from './associar-socio/associar-socio.component';
import { DespesasComponent } from './despesas/despesas.component';
import { ReceitasComponent } from './receitas/receitas.component';
import { ReviewTransacoesComponent } from './review-transacoes/review-transacoes.component';
import { TransacoesPendentesDetalhesComponent } from './transacoes-pendentes/transacoes-pendentes-detalhes.component';
import { TransacoesPendentesComponent } from './transacoes-pendentes/transacoes-pendentes.component';

@NgModule({
  declarations: [
    ContasPagarListarComponent,
    ContasPagarFormComponent,
    ContasPagarDetalhesComponent,
    ContasPagarPagamentoComponent,
    CobrancasAvulsasListarComponent,
    CobrancasAvulsasFormComponent,
    CobrancasAvulsasDetalhesComponent,
    CobrancasAvulsasPagamentoComponent,
    ContasAReceberListarComponent,
    ContasAReceberFormComponent,
    ContasAReceberDetalhesComponent,
    ContasAReceberPagamentoComponent,
    UploadOfxComponent,
    ReviewTransacoesComponent,
    TransacoesPendentesComponent,
    TransacoesPendentesDetalhesComponent,
    ReceitasComponent,
    DespesasComponent,
    ReviewTransacoesComponent,
    AssociarSocioComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FlatpickrModule.forRoot(),
    NgxCurrencyDirective,
    SharedModule,
    FinanceiroRoutingModule,
  ],
  exports: [],
})
export class FinanceiroModule {}
