import { Component, OnInit } from '@angular/core';
import { CobrancasAvulsasService, Cobranca } from './cobrancas-avulsas.service';

@Component({
  selector: 'app-cobrancas-avulsas-listar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Cobranças</h4>
                <div class="flex-shrink-0">
                  <button 
                    class="btn btn-primary"
                    routerLink="/pages/financeiro/cobrancas-avulsas/novo">
                    <i class="ri-add-line align-bottom me-1"></i> Nova Cobrança
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
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
                      <tr *ngFor="let cobranca of cobrancas; trackBy: trackByFn">
                        <td>{{ cobranca.id }}</td>
                        <td>
                          <span class="badge bg-info">{{ cobranca.tipoCobranca }}</span>
                        </td>
                        <td>
                          {{ cobranca.socioNome || cobranca.fornecedorNome || '-' }}
                        </td>
                        <td>{{ cobranca.rubricaNome || '-' }}</td>
                        <td>{{ cobranca.descricao }}</td>
                        <td>{{ cobranca.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>
                          {{ cobranca.valorPago ? (cobranca.valorPago | currency:'BRL':'symbol':'1.2-2') : '-' }}
                        </td>
                        <td>{{ cobranca.dataVencimento | date:'dd/MM/yyyy' }}</td>
                        <td>
                          {{ cobranca.dataPagamento ? (cobranca.dataPagamento | date:'dd/MM/yyyy') : '-' }}
                        </td>
                        <td>
                          <span class="badge" [ngClass]="getStatusClass(cobranca.status)">
                            {{ cobranca.status | titlecase }}
                          </span>
                        </td>
                        <td>
                          <div class="hstack gap-2">
                            <button 
                              class="btn btn-soft-info btn-sm"
                              [routerLink]="['/pages/financeiro/cobrancas-avulsas/detalhes', cobranca.id]">
                              <i class="ri-eye-fill align-bottom"></i>
                            </button>
                            <button 
                              class="btn btn-soft-primary btn-sm"
                              [routerLink]="['/pages/financeiro/cobrancas-avulsas/editar', cobranca.id]"
                              [disabled]="cobranca.status === 'PAGA'">
                              <i class="ri-pencil-fill align-bottom"></i>
                            </button>
                            <button 
                              class="btn btn-soft-success btn-sm"
                              [routerLink]="['/pages/financeiro/cobrancas-avulsas/pagamento', cobranca.id]"
                              [disabled]="cobranca.status === 'PAGA' || cobranca.status === 'CANCELADA'">
                              <i class="ri-money-dollar-circle-fill align-bottom"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!cobrancas || cobrancas.length === 0">
                        <td colspan="11" class="text-center">Nenhuma cobrança encontrada</td>
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
export class CobrancasAvulsasListarComponent implements OnInit {

  cobrancas: Cobranca[] = [];

  constructor(private cobrancasAvulsasService: CobrancasAvulsasService) { }

  ngOnInit(): void {
    this.loadCobrancas();
  }

  loadCobrancas(): void {
    this.cobrancasAvulsasService.getAll().subscribe({
      next: (data) => {
        this.cobrancas = data;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças:', error);
      }
    });
  }

  trackByFn(index: number, item: Cobranca): number {
    return item.id!;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'ABERTA': return 'bg-warning';
      case 'PAGA': return 'bg-success';
      case 'CANCELADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}