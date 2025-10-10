import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContasPagarDetalhesComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarFormComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarListarComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarPagamentoComponent } from './constapagarreceber/contas-a-pagar/contas-a-pagar-pagamento.component';
import { ContasAReceberDetalhesComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-detalhes.component';
import { ContasAReceberFormComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-form.component';
import { ContasAReceberListarComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberPagamentoComponent } from './constapagarreceber/contas-a-receber/contas-a-receber-pagamento.component';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { UploadOfxComponent } from './upload-ofx/upload-ofx.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewTransacoesComponent } from './transasoes/review-transacoes/review-transacoes.component';

import { TransacoesCreditoEditarComponent } from './transasoes/transacoes-credito/transacoes-credito-editar/transacoes-credito-editar.component';
import { TransacoesCreditoComponent } from './transasoes/transacoes-credito/transacoes-credito.component';
import { TransacoesDebitoComponent } from './transasoes/transacoes-debito/transacoes-debito.component';

@NgModule({
  declarations: [
    ContasPagarListarComponent,
    ContasPagarFormComponent,
    ContasPagarDetalhesComponent,
    ContasPagarPagamentoComponent,
    ContasAReceberListarComponent,
    ContasAReceberFormComponent,
    ContasAReceberDetalhesComponent,
    ContasAReceberPagamentoComponent,
    UploadOfxComponent,
    ReviewTransacoesComponent,
    TransacoesCreditoComponent,
    TransacoesDebitoComponent,
    TransacoesCreditoEditarComponent,
  ],
  imports: [
    CurrencyPipe,
    DatePipe,
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
