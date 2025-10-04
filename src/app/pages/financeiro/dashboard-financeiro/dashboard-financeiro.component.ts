import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContasReceberService, ContasPagarService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-dashboard-financeiro',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 class="mb-sm-0">Dashboard Financeiro</h4>
            </div>
          </div>
        </div>

        <!-- Cards de resumo -->
        <div class="row">
          <div class="col-xl-3 col-md-6">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 overflow-hidden">
                    <p class="text-uppercase fw-medium text-muted text-truncate mb-0">Total a Receber</p>
                  </div>
                </div>
                <div class="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                      <span class="counter-value">{{ totalAReceber | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </h4>
                    <button type="button" class="text-decoration-underline btn btn-link p-0" (click)="navegarParaContas('receber')">
                      Ver detalhes
                    </button>
                  </div>
                  <div class="avatar-sm flex-shrink-0">
                    <span class="avatar-title bg-success rounded fs-3">
                      <i class="ri-arrow-right-up-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 overflow-hidden">
                    <p class="text-uppercase fw-medium text-muted text-truncate mb-0">Total a Pagar</p>
                  </div>
                </div>
                <div class="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                      <span class="counter-value">{{ totalAPagar | currency:'BRL':'symbol':'1.2-2' }}</span>
                    </h4>
                    <button type="button" class="text-decoration-underline btn btn-link p-0" (click)="navegarParaContas('pagar')">
                      Ver detalhes
                    </button>
                  </div>
                  <div class="avatar-sm flex-shrink-0">
                    <span class="avatar-title bg-danger rounded fs-3">
                      <i class="ri-arrow-left-down-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 overflow-hidden">
                    <p class="text-uppercase fw-medium text-muted text-truncate mb-0">Saldo Atual</p>
                  </div>
                </div>
                <div class="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                      <span class="counter-value" [ngClass]="saldoAtual >= 0 ? 'text-success' : 'text-danger'">
                        {{ saldoAtual | currency:'BRL':'symbol':'1.2-2' }}
                      </span>
                    </h4>
                    <p class="text-muted mb-0">Receber - Pagar</p>
                  </div>
                  <div class="avatar-sm flex-shrink-0">
                    <span class="avatar-title rounded fs-3" [ngClass]="saldoAtual >= 0 ? 'bg-success' : 'bg-danger'">
                      <i class="ri-bank-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-3 col-md-6">
            <div class="card card-animate">
              <div class="card-body">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1 overflow-hidden">
                    <p class="text-uppercase fw-medium text-muted text-truncate mb-0">A Vencer Próximos 7 Dias</p>
                  </div>
                </div>
                <div class="d-flex align-items-end justify-content-between mt-4">
                  <div>
                    <h4 class="fs-22 fw-semibold ff-secondary mb-4">
                      <span class="counter-value">{{ contasProximasVencimento }}</span>
                    </h4>
                    <p class="text-muted mb-0">Contas a receber e pagar</p>
                  </div>
                  <div class="avatar-sm flex-shrink-0">
                    <span class="avatar-title bg-warning rounded fs-3">
                      <i class="ri-calendar-event-line"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos e listas -->
        <div class="row">
          <div class="col-xl-8">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Fluxo de Caixa - Próximos 30 dias</h4>
              </div>
              <div class="card-body">
                <div class="alert alert-info">
                  <i class="ri-information-line me-2"></i>
                  Gráfico de fluxo de caixa será implementado aqui
                </div>
                <div class="text-center mt-4">
                  <img src="assets/images/logo-sm.png" alt="" height="40">
                  <p class="mt-2">Visualização gráfica do fluxo de caixa</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-4">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Movimentações Recentes</h4>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-borderless table-nowrap align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th scope="col">Descrição</th>
                        <th scope="col">Tipo</th>
                        <th scope="col" class="text-end">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let movimentacao of movimentacoesRecentes">
                        <td>{{ movimentacao.descricao }}</td>
                        <td>
                          <span class="badge" [ngClass]="movimentacao.tipo === 'RECEBIMENTO' ? 'bg-success' : 'bg-danger'">
                            {{ movimentacao.tipo }}
                          </span>
                        </td>
                        <td class="text-end">
                          <span [ngClass]="movimentacao.tipo === 'RECEBIMENTO' ? 'text-success' : 'text-danger'">
                            {{ movimentacao.valor | currency:'BRL':'symbol':'1.2-2' }}
                          </span>
                        </td>
                      </tr>
                      <tr *ngIf="movimentacoesRecentes.length === 0">
                        <td colspan="3" class="text-center text-muted">
                          Nenhuma movimentação recente
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contas a vencer e vencidas -->
        <div class="row">
          <div class="col-xl-6">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas a Vencer (Próximos 7 dias)</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-primary btn-sm" (click)="navegarParaContas('receber')">
                    Ver Todas
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th scope="col">Descrição</th>
                        <th scope="col">Cliente/Fornecedor</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Vencimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let conta of contasAVencer">
                        <td>{{ conta.descricao }}</td>
                        <td>{{ conta.clienteNome }}</td>
                        <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ conta.dataVencimento | date:'shortDate' }}</td>
                      </tr>
                      <tr *ngIf="contasAVencer.length === 0">
                        <td colspan="4" class="text-center">
                          Nenhuma conta próxima de vencer
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div class="col-xl-6">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas Vencidas</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-primary btn-sm" (click)="navegarParaContasVencidas()">
                    Ver Todas
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th scope="col">Descrição</th>
                        <th scope="col">Cliente/Fornecedor</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Vencimento</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let conta of contasVencidas">
                        <td>{{ conta.descricao }}</td>
                        <td>{{ conta.clienteNome }}</td>
                        <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ conta.dataVencimento | date:'shortDate' }}</td>
                      </tr>
                      <tr *ngIf="contasVencidas.length === 0">
                        <td colspan="4" class="text-center">
                          Nenhuma conta vencida
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardFinanceiroComponent implements OnInit {
  totalAReceber = 0;
  totalAPagar = 0;
  saldoAtual = 0;
  contasProximasVencimento = 0;
  
  movimentacoesRecentes: Array<{descricao: string, tipo: string, valor: number, data: string}> = [];
  contasAVencer: Array<{descricao: string, clienteNome: string, valor: number, dataVencimento: string}> = [];
  contasVencidas: Array<{descricao: string, clienteNome: string, valor: number, dataVencimento: string}> = [];

  constructor(
    private router: Router,
    private contasReceberService: ContasReceberService,
    private contasPagarService: ContasPagarService,
    private dadosAuxiliaresService: DadosAuxiliaresService
  ) {}

  ngOnInit(): void {
    this.carregarDadosDashboard();
  }

  carregarDadosDashboard(): void {
    // Carregar contas a receber
    this.contasReceberService.listarCobrancas(0, 1000).subscribe({
      next: (response) => {
        response.content.forEach(cobranca => {
          if (cobranca.status === 'ABERTA') {
            this.totalAReceber += cobranca.valorOriginal;
          }
          
          // Verificar contas a vencer
          const dataVencimento = new Date(cobranca.dataVencimento);
          const hoje = new Date();
          const diferencaDias = (dataVencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24);
          
          if (diferencaDias >= 0 && diferencaDias <= 7 && cobranca.status === 'ABERTA') {
            this.contasAVencer.push({
              descricao: cobranca.descricao,
              clienteNome: cobranca.socioNome || cobranca.fornecedorNome || 'Cliente não identificado',
              valor: cobranca.valorOriginal,
              dataVencimento: cobranca.dataVencimento
            });
            this.contasProximasVencimento++;
          }
          
          // Verificar contas vencidas
          if (dataVencimento < hoje && cobranca.status === 'ABERTA') {
            this.contasVencidas.push({
              descricao: cobranca.descricao,
              clienteNome: cobranca.socioNome || cobranca.fornecedorNome || 'Cliente não identificado',
              valor: cobranca.valorOriginal,
              dataVencimento: cobranca.dataVencimento
            });
          }
        });
        
        this.atualizarSaldo();
      },
      error: (error) => {
        console.error('Erro ao carregar contas a receber:', error);
      }
    });

    // Carregar contas a pagar
    this.contasPagarService.listarContasPagar(0, 1000).subscribe({
      next: (response) => {
        response.content.forEach(conta => {
          if (conta.status === 'ABERTA') {
            this.totalAPagar += conta.valor;
          }
          
          // Verificar contas a vencer
          const dataVencimento = new Date(conta.dataVencimento);
          const hoje = new Date();
          const diferencaDias = (dataVencimento.getTime() - hoje.getTime()) / (1000 * 3600 * 24);
          
          if (diferencaDias >= 0 && diferencaDias <= 7 && conta.status === 'ABERTA') {
            this.contasAVencer.push({
              descricao: conta.descricao,
              clienteNome: conta.fornecedorNome || 'Fornecedor não identificado',
              valor: conta.valor,
              dataVencimento: conta.dataVencimento
            });
            this.contasProximasVencimento++;
          }
          
          // Verificar contas vencidas
          if (dataVencimento < hoje && conta.status === 'ABERTA') {
            this.contasVencidas.push({
              descricao: conta.descricao,
              clienteNome: conta.fornecedorNome || 'Fornecedor não identificado',
              valor: conta.valor,
              dataVencimento: conta.dataVencimento
            });
          }
        });
        
        this.atualizarSaldo();
      },
      error: (error) => {
        console.error('Erro ao carregar contas a pagar:', error);
      }
    });

    // Dados simulados para movimentações recentes
    this.movimentacoesRecentes = [
      { descricao: 'Pagamento de aluguel', tipo: 'PAGAMENTO', valor: 5000.00, data: '2023-10-01' },
      { descricao: 'Recebimento de mensalidade', tipo: 'RECEBIMENTO', valor: 2500.00, data: '2023-10-05' },
      { descricao: 'Compra de material de escritório', tipo: 'PAGAMENTO', valor: 350.00, data: '2023-10-03' }
    ];
  }

  atualizarSaldo(): void {
    this.saldoAtual = this.totalAReceber - this.totalAPagar;
  }

  navegarParaContas(tipo: 'receber' | 'pagar'): void {
    if (tipo === 'receber') {
      this.router.navigate(['/pages/financeiro/contas-receber/lista']);
    } else {
      this.router.navigate(['/pages/financeiro/contas-pagar/lista']);
    }
  }

  navegarParaContasVencidas(): void {
    // Navegar para uma página que liste todas as contas vencidas
    this.router.navigate(['/pages/financeiro/relatorios'], { queryParams: { status: 'VENCIDA' } });
  }
}