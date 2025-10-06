import { Component, OnInit } from '@angular/core';
import { ContasPagarService, ContaPagar } from '../contas-a-pagar/contas-a-pagar.service';

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
                  <button 
                    class="btn btn-primary"
                    routerLink="/pages/financeiro/contas-a-receber/novo">
                    <i class="ri-add-line align-bottom me-1"></i> Nova Conta
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Rubrica</th>
                        <th>Descrição</th>
                        <th>Valor Original</th>
                        <th>Valor Pago</th>
                        <th>Data Vencimento</th>
                        <th>Data Pagamento</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let conta of contas; trackBy: trackByFn">
                        <td>{{ conta.id }}</td>
                        <td>{{ conta.fornecedorNome || '-' }}</td>
                        <td>{{ conta.rubricaNome || '-' }}</td>
                        <td>{{ conta.descricao }}</td>
                        <td>{{ conta?.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>
                          {{ conta?.dataPagamento ? (conta.valor | currency:'BRL':'symbol':'1.2-2') : '-' }}
                        </td>
                        <td>{{ conta?.dataVencimento | date:'dd/MM/yyyy' }}</td>
                        <td>
                          {{ conta?.dataPagamento ? (conta.dataPagamento | date:'dd/MM/yyyy') : '-' }}
                        </td>
                        <td>
                          <span class="badge" [ngClass]="getStatusClass(conta.status)">
                            {{ conta.status | titlecase }}
                          </span>
                        </td>
                        <td>
                          <div class="hstack gap-2">
                            <button 
                              class="btn btn-soft-info btn-sm"
                              [routerLink]="['/pages/financeiro/contas-a-receber/detalhes', conta.id]">
                              <i class="ri-eye-fill align-bottom"></i>
                            </button>
                            <button 
                              class="btn btn-soft-primary btn-sm"
                              [routerLink]="['/pages/financeiro/contas-a-receber/editar', conta.id]"
                              [disabled]="conta.status === 'PAGA'">
                              <i class="ri-pencil-fill align-bottom"></i>
                            </button>
                            <button 
                              class="btn btn-soft-success btn-sm"
                              [routerLink]="['/pages/financeiro/contas-a-receber/pagamento', conta.id]"
                              [disabled]="conta.status === 'PAGA' || conta.status === 'CANCELADA'">
                              <i class="ri-money-dollar-circle-fill align-bottom"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!contas || contas.length === 0">
                        <td colspan="10" class="text-center">Nenhuma conta a receber encontrada</td>
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
  styles: []
})
export class ContasAReceberListarComponent implements OnInit {

  contas: ContaPagar[] = [];

  constructor(private contasPagarService: ContasPagarService) { }

  ngOnInit(): void {
    this.loadContas();
  }

  loadContas(): void {
    // Usando o serviço de contas a pagar como exemplo, substituir por serviço próprio quando criado
    // this.contasAReceberService.getAll().subscribe({
    //   next: (data) => {
    //     this.contas = data;
    //   },
    //   error: (error) => {
    //     console.error('Erro ao carregar contas a receber:', error);
    //   }
    // });
  }

  trackByFn(index: number, item: ContaPagar): number {
    return item.id!;
  }

  getStatusClass(status: string | undefined | null): string {
    switch(status) {
      case 'ABERTA': return 'bg-warning';
      case 'PAGA': return 'bg-success';
      case 'CANCELADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}