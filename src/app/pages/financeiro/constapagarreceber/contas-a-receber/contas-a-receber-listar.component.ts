import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contas-a-receber-listar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas a Receber</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-info" (click)="onNovo()">
                    <i class="ri-add-line align-bottom me-1"></i> Adicionar
                  </button>
                </div>
              </div>
              <div class="card-body">
                <!-- Filtros -->
                <div class="row mb-4">
                  <div class="col-md-3">
                    <label for="statusFiltro" class="form-label">Status</label>
                    <select class="form-select" id="statusFiltro" [(ngModel)]="filtroStatus">
                      <option value="">Todos</option>
                      <option value="PENDENTE">Pendente</option>
                      <option value="PAGO">Pago</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="dataInicio" class="form-label">Data Início</label>
                    <input type="date" class="form-control" id="dataInicio" [(ngModel)]="filtroDataInicio">
                  </div>
                  <div class="col-md-3">
                    <label for="dataFim" class="form-label">Data Fim</label>
                    <input type="date" class="form-control" id="dataFim" [(ngModel)]="filtroDataFim">
                  </div>
                  <div class="col-md-3 align-self-end">
                    <button type="button" class="btn btn-primary w-100" (click)="aplicarFiltros()">
                      <i class="ri-search-line align-bottom me-1"></i> Filtrar
                    </button>
                  </div>
                </div>

                <!-- Tabela de contas a receber -->
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                        <th class="text-center">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let conta of contasFiltradas; trackBy: trackByFn">
                        <td>{{ conta.descricao }}</td>
                        <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ conta.dataVencimento | date:'dd/MM/yyyy' }}</td>
                        <td class="text-center">
                          <span class="badge" [ngClass]="getStatusClass(conta.status)">
                            {{ getStatusText(conta.status) }}
                          </span>
                        </td>
                        <td class="text-center hstack gap-2">
                          <button class="btn btn-soft-info btn-sm" (click)="onDetalhes(conta)">
                            <i class="ri-eye-fill align-bottom"></i>
                          </button>
                          <button class="btn btn-soft-warning btn-sm" (click)="onEditar(conta)">
                            <i class="ri-pencil-fill align-bottom"></i>
                          </button>
                          <button class="btn btn-soft-success btn-sm" (click)="onReceber(conta)" 
                            [disabled]="conta.status === 'PAGO' || conta.status === 'CANCELADO'">
                            <i class="ri-bank-line align-bottom"></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mensagem quando não há resultados -->
                <div *ngIf="contasFiltradas.length === 0" class="text-center py-4">
                  <i class="ri-bank-card-2-line display-4 text-muted"></i>
                  <h5 class="mt-3">Nenhuma conta a receber encontrada</h5>
                  <p class="text-muted">Não há contas a receber correspondentes aos filtros aplicados.</p>
                  <button type="button" class="btn btn-primary" (click)="onNovo()">
                    <i class="ri-add-line align-bottom me-1"></i> Adicionar Primeira Conta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContasAReceberListarComponent implements OnInit {
  contas: any[] = []; // This would be replaced with the actual ContaAReceber model
  contasFiltradas: any[] = [];
  
  // Filtros
  filtroStatus: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';

  constructor() { }

  ngOnInit(): void {
    this.carregarContas();
  }

  carregarContas(): void {
    // This would load data from a service
    // For now, using mock data
    this.contas = [
      {
        id: 1,
        descricao: 'Venda de produtos - Cliente X',
        valor: 1500.00,
        dataVencimento: '2025-01-15',
        status: 'PENDENTE',
        categoria: 'RECEITA',
        formaPagamento: 'BOLETO'
      },
      {
        id: 2,
        descricao: 'Prestação de serviço - Cliente Y',
        valor: 2500.00,
        dataVencimento: '2025-01-20',
        status: 'PAGO',
        categoria: 'RECEITA',
        formaPagamento: 'PIX'
      },
      {
        id: 3,
        descricao: 'Recorrência mensal - Cliente Z',
        valor: 800.00,
        dataVencimento: '2025-01-25',
        status: 'PENDENTE',
        categoria: 'RECEITA',
        formaPagamento: 'CARTAO'
      }
    ];
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.contasFiltradas = this.contas.filter(conta => {
      return (
        (!this.filtroStatus || conta.status === this.filtroStatus) &&
        (!this.filtroDataInicio || conta.dataVencimento >= this.filtroDataInicio) &&
        (!this.filtroDataFim || conta.dataVencimento <= this.filtroDataFim)
      );
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'bg-success';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  }

  trackByFn(index: number, item: any): number {
    return item.id;
  }

  onNovo(): void {
    console.log('Nova conta a receber');
    // Navigate to new form
  }

  onDetalhes(conta: any): void {
    console.log('Detalhes da conta:', conta);
    // Navigate to details page
  }

  onEditar(conta: any): void {
    console.log('Editar conta:', conta);
    // Navigate to edit form
  }

  onReceber(conta: any): void {
    console.log('Registrar recebimento:', conta);
    // Navigate to payment form or open modal
  }
}