import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Page, CobrancaAvulsa, ContaPagar } from '../financeiro.model';
import { ContasReceberService, ContasPagarService } from '../financeiro.service';

@Component({
  selector: 'app-relatorios-financeiros',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Relatórios Financeiros</h4>
              </div>
              <div class="card-body">
                <form [formGroup]="filtroForm" (ngSubmit)="filtrar()" class="row g-3">
                  <div class="col-lg-3">
                    <label for="dataInicio" class="form-label">Data Início</label>
                    <input type="date" class="form-control" id="dataInicio" formControlName="dataInicio">
                  </div>
                  
                  <div class="col-lg-3">
                    <label for="dataFim" class="form-label">Data Fim</label>
                    <input type="date" class="form-control" id="dataFim" formControlName="dataFim">
                  </div>
                  
                  <div class="col-lg-3">
                    <label for="tipo" class="form-label">Tipo</label>
                    <select class="form-control" id="tipo" formControlName="tipo">
                      <option value="">Todos</option>
                      <option value="RECEBER">Contas a Receber</option>
                      <option value="PAGAR">Contas a Pagar</option>
                    </select>
                  </div>
                  
                  <div class="col-lg-3 d-flex align-items-end">
                    <button type="submit" class="btn btn-primary w-100">
                      <i class="ri-search-line align-bottom me-1"></i> Filtrar
                    </button>
                  </div>
                </form>
                
                <div class="row mt-4">
                  <div class="col-lg-6">
                    <div class="card border">
                      <div class="card-body">
                        <h5 class="card-title">Resumo de Contas a Receber</h5>
                        <div class="d-flex justify-content-between">
                          <div>
                            <p class="text-muted mb-1">Total Recebido</p>
                            <h4 class="mb-0">{{ totalRecebido | currency:'BRL':'symbol':'1.2-2' }}</h4>
                          </div>
                          <div>
                            <p class="text-muted mb-1">Total em Aberto</p>
                            <h4 class="mb-0">{{ totalReceberAberto | currency:'BRL':'symbol':'1.2-2' }}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-lg-6">
                    <div class="card border">
                      <div class="card-body">
                        <h5 class="card-title">Resumo de Contas a Pagar</h5>
                        <div class="d-flex justify-content-between">
                          <div>
                            <p class="text-muted mb-1">Total Pago</p>
                            <h4 class="mb-0">{{ totalPago | currency:'BRL':'symbol':'1.2-2' }}</h4>
                          </div>
                          <div>
                            <p class="text-muted mb-1">Total em Aberto</p>
                            <h4 class="mb-0">{{ totalPagarAberto | currency:'BRL':'symbol':'1.2-2' }}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="table-responsive mt-4">
                  <table class="table table-striped table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Data Vencimento</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of itens">
                        <td>{{ item.id }}</td>
                        <td>{{ item.descricao }}</td>
                        <td>
                          <span class="badge" [ngClass]="item.tipo === 'RECEBER' ? 'bg-success' : 'bg-danger'">
                            {{ item.tipo === 'RECEBER' ? 'Receber' : 'Pagar' }}
                          </span>
                        </td>
                        <td>{{ item.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ item.dataVencimento | date:'shortDate' }}</td>
                        <td>
                          <span class="badge" [ngClass]="getStatusBadgeClass(item.status)">
                            {{ getStatusText(item.status) }}
                          </span>
                        </td>
                      </tr>
                      <tr *ngIf="itens.length === 0">
                        <td colspan="6" class="text-center">
                          Nenhum item encontrado para os filtros aplicados
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
export class RelatoriosFinanceirosComponent implements OnInit {
  filtroForm: FormGroup;
  itens: Array<{id: number, descricao: string, tipo: string, valor: number, dataVencimento: string, status: string}> = [];
  
  totalRecebido = 0;
  totalReceberAberto = 0;
  totalPago = 0;
  totalPagarAberto = 0;

  constructor(
    private fb: FormBuilder,
    private contasReceberService: ContasReceberService,
    private contasPagarService: ContasPagarService
  ) {
    this.filtroForm = this.fb.group({
      dataInicio: [''],
      dataFim: [''],
      tipo: ['']
    });
  }

  ngOnInit(): void {
    // Carregar dados iniciais
    this.filtrar();
  }

  filtrar(): void {
    const filtros = this.filtroForm.value;
    
    // Limpar dados anteriores
    this.itens = [];
    this.totalRecebido = 0;
    this.totalReceberAberto = 0;
    this.totalPago = 0;
    this.totalPagarAberto = 0;
    
    // Carregar contas a receber se aplicável
    if (!filtros.tipo || filtros.tipo === 'RECEBER') {
      this.carregarContasReceber(filtros);
    }
    
    // Carregar contas a pagar se aplicável
    if (!filtros.tipo || filtros.tipo === 'PAGAR') {
      this.carregarContasPagar(filtros);
    }
  }

  carregarContasReceber(filtros: any): void {
    this.contasReceberService.listarCobrancas(0, 1000).subscribe({
      next: (response: Page<CobrancaAvulsa>) => {
        const cobrancas = response.content.filter(cobranca => {
          // Aplicar filtros de data se fornecidos
          if (filtros.dataInicio && new Date(cobranca.dataVencimento) < new Date(filtros.dataInicio)) {
            return false;
          }
          if (filtros.dataFim && new Date(cobranca.dataVencimento) > new Date(filtros.dataFim)) {
            return false;
          }
          return true;
        });
        
        // Adicionar ao array de itens
        cobrancas.forEach(cobranca => {
          this.itens.push({
            id: cobranca.id || 0,
            descricao: cobranca.descricao,
            tipo: 'RECEBER',
            valor: cobranca.valorOriginal,
            dataVencimento: cobranca.dataVencimento,
            status: cobranca.status
          });
          
          // Atualizar totais
          if (cobranca.status === 'PAGA' || cobranca.status === 'QUITADA') {
            this.totalRecebido += cobranca.valorPago || 0;
          } else if (cobranca.status === 'ABERTA' || cobranca.status === 'VENCIDA') {
            this.totalReceberAberto += cobranca.valorOriginal;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar contas a receber:', error);
      }
    });
  }

  carregarContasPagar(filtros: any): void {
    this.contasPagarService.listarContasPagar(0, 1000).subscribe({
      next: (response: Page<ContaPagar>) => {
        const contas = response.content.filter(conta => {
          // Aplicar filtros de data se fornecidos
          if (filtros.dataInicio && new Date(conta.dataVencimento) < new Date(filtros.dataInicio)) {
            return false;
          }
          if (filtros.dataFim && new Date(conta.dataVencimento) > new Date(filtros.dataFim)) {
            return false;
          }
          return true;
        });
        
        // Adicionar ao array de itens
        contas.forEach(conta => {
          this.itens.push({
            id: conta.id || 0,
            descricao: conta.descricao,
            tipo: 'PAGAR',
            valor: conta.valor,
            dataVencimento: conta.dataVencimento,
            status: conta.status
          });
          
          // Atualizar totais
          if (conta.status === 'PAGA') {
            this.totalPago += conta.valor;
          } else if (conta.status === 'ABERTA') {
            this.totalPagarAberto += conta.valor;
          }
        });
      },
      error: (error) => {
        console.error('Erro ao carregar contas a pagar:', error);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ABERTA': return 'Aberta';
      case 'PAGA': return 'Paga';
      case 'VENCIDA': return 'Vencida';
      case 'CANCELADA': return 'Cancelada';
      case 'QUITADA': return 'Quitada';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-warning';
      case 'PAGA': return 'bg-success';
      case 'VENCIDA': return 'bg-danger';
      case 'CANCELADA': return 'bg-secondary';
      case 'QUITADA': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}