import { Component, OnInit } from '@angular/core';
import { ContasPagarService, ContaPagar } from './contas-a-pagar.service';

@Component({
  selector: 'app-contas-a-pagar-listar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas a Pagar</h4>
                <div class="flex-shrink-0">
                  <button 
                    class="btn btn-primary"
                    routerLink="/pages/financeiro/contas-a-pagar/novo">
                    <i class="ri-add-line align-bottom me-1"></i> Nova Conta
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">

      <div class="card">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fornecedor</th>
                  <th>Rubrica</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Data Vencimento</th>
                  <th>Data Pagamento</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let conta of contas; trackBy: trackByFn">
                  <td>{{ conta.id }}</td>
                  <td>{{ conta.fornecedorNome }}</td>
                  <td>{{ conta.rubricaNome }}</td>
                  <td>{{ conta.descricao }}</td>
                  <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                  <td>{{ conta.dataVencimento | date:'dd/MM/yyyy' }}</td>
                  <td>{{ conta.dataPagamento ? (conta.dataPagamento | date:'dd/MM/yyyy') : '-' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getStatusClass(conta.status)">
                      {{ conta.status | titlecase }}
                    </span>
                  </td>
                  <td>
                    <button 
                      class="btn btn-sm btn-outline-primary me-1"
                      [routerLink]="['/pages/financeiro/contas-a-pagar/detalhes', conta.id]">
                      <i class="bi bi-eye"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-secondary me-1"
                      [routerLink]="['/pages/financeiro/contas-a-pagar/editar', conta.id]">
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button 
                      class="btn btn-sm btn-outline-success"
                      (click)="registrarPagamento(conta)"
                      [disabled]="conta.status !== 'ABERTA'">
                      <i class="bi bi-cash"></i>
                    </button>
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
  `,
  styles: [`
    .badge {
      font-size: 0.8em;
    }
    .badge.ABERTA {
      background-color: #ffc107;
      color: #000;
    }
    .badge.PAGA {
      background-color: #28a745;
      color: white;
    }
    .badge.CANCELADA {
      background-color: #dc3545;
      color: white;
    }
  `]
})
export class ContasPagarListarComponent implements OnInit {

  contas: ContaPagar[] = [];

  constructor(private contasPagarService: ContasPagarService) { }

  ngOnInit(): void {
    this.loadContas();
  }

  loadContas(): void {
    this.contasPagarService.getAll().subscribe({
      next: (data) => {
        this.contas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar contas a pagar:', error);
      }
    });
  }

  trackByFn(index: number, item: ContaPagar): number {
    return item.id!;
  }

  getStatusClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }

  registrarPagamento(conta: ContaPagar): void {
    // Lógica para abrir modal ou componente de pagamento
    console.log('Registrar pagamento para conta:', conta.id);
    // Em implementação real, isso abriria um modal para selecionar conta financeira
  }
}