import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FinanceiroRoutingModule } from './financeiro-routing.module';
import { ContasPagarListarComponent } from './contas-a-pagar/contas-a-pagar-listar.component';
import { ContasPagarFormComponent } from './contas-a-pagar/contas-a-pagar-form.component';
import { ContasPagarDetalhesComponent } from './contas-a-pagar/contas-a-pagar-detalhes.component';
import { ContasPagarPagamentoComponent } from './contas-a-pagar/contas-a-pagar-pagamento.component';
import { CobrancasAvulsasListarComponent } from './cobrancas-avulsas/cobrancas-avulsas-listar.component';
import { CobrancasAvulsasFormComponent } from './cobrancas-avulsas/cobrancas-avulsas-form.component';
import { CobrancasAvulsasDetalhesComponent } from './cobrancas-avulsas/cobrancas-avulsas-detalhes.component';
import { CobrancasAvulsasPagamentoComponent } from './cobrancas-avulsas/cobrancas-avulsas-pagamento.component';
import { ContasAReceberListarComponent } from './contas-a-receber/contas-a-receber-listar.component';
import { ContasAReceberFormComponent } from './contas-a-receber/contas-a-receber-form.component';
import { UploadOfxComponent } from './upload-ofx/upload-ofx.component';
import { QuitacaoCreditoComponent } from './quitacao-credito/quitacao-credito.component';
import { QuitarTransacoesComponent } from './quitar-transacoes/quitar-transacoes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SharedModule } from 'src/app/shared/shared.module';

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
    UploadOfxComponent,
    QuitacaoCreditoComponent,
    QuitarTransacoesComponent,
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
  exports: [
  ]
})
export class FinanceiroModule {}