import { Component, OnInit } from '@angular/core';
import { Cobranca } from '../cobrancas/non-monthly-billing.model';
import { NonMonthlyBillingService } from '../cobrancas/non-monthly-billing.service';

@Component({
  selector: 'app-billing-list',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Lista de Cobranças</h4>
              </div>
              <div class="card-body">
                <!-- Carregando -->
                <div *ngIf="loading" class="d-flex justify-content-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                </div>

                <!-- Lista de Cobranças -->
                <div class="table-responsive" *ngIf="!loading">
                  <table class="table table-striped table-nowrap align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Sócio</th>
                        <th scope="col">Descrição</th>
                        <th scope="col">Rubrica</th>
                        <th scope="col">Valor</th>
                        <th scope="col">Data Vencimento</th>
                        <th scope="col">Tipo Cobrança</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let cobranca of cobrancas">
                        <td>{{ cobranca.id }}</td>
                        <td>{{ cobranca.socioNome || cobranca.socioId }}</td>
                        <td>{{ cobranca.descricao }}</td>
                        <td>{{ cobranca.rubricaNome || cobranca.rubricaId || 'N/A' }}</td>
                        <td>{{ cobranca.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ cobranca.dataVencimento | date:'shortDate' }}</td>
                        <td>{{ cobranca.tipoCobranca }}</td>
                        <td>
                          <span class="badge" [ngClass]="getStatusBadgeClass(cobranca.status)">
                            {{ cobranca.status }}
                          </span>
                        </td>
                        <td>
                          <div class="hstack gap-3 flex-wrap">
                            <button type="button" class="btn btn-sm btn-soft-info edit-item-btn">
                              Editar
                            </button>
                            <button type="button" class="btn btn-sm btn-soft-danger remove-item-btn">
                              Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="cobrancas.length === 0">
                        <td colspan="9" class="text-center">Nenhuma cobrança encontrada</td>
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
export class BillingListComponent implements OnInit {
  cobrancas: Cobranca[] = [];
  loading = true;

  constructor(private billingService: NonMonthlyBillingService) { }

  ngOnInit(): void {
    this.carregarCobrancas();
  }

  carregarCobrancas(): void {
    this.loading = true;
    this.billingService.getNonMonthlyBillings().subscribe({
      next: (cobrancas) => {
        this.cobrancas = cobrancas;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças:', error);
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pago':
        return 'bg-success';
      case 'aberta':
      case 'pendente':
        return 'bg-warning';
      case 'cancelado':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}