import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CobrancasAvulsasService, Cobranca } from './cobrancas-avulsas.service';

@Component({
  selector: 'app-cobrancas-avulsas-detalhes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Detalhes da Cobrança</h4>
                <div class="flex-shrink-0">
                  <button 
                    class="btn btn-light"
                    (click)="voltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
                </div>
              </div>
              <div class="card-body" *ngIf="cobranca">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">ID</label>
                      <div class="form-control" readonly>{{ cobranca.id }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Tipo de Cobrança</label>
                      <div class="form-control" readonly>{{ cobranca.tipoCobranca }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Sócio</label>
                      <div class="form-control" readonly>{{ cobranca.socioNome || '-' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Fornecedor</label>
                      <div class="form-control" readonly>{{ cobranca.fornecedorNome || '-' }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Rubrica</label>
                      <div class="form-control" readonly>{{ cobranca.rubricaNome || '-' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <div class="form-control" [ngClass]="'status-' + cobranca.status.toLowerCase()" readonly>
                        {{ cobranca.status | titlecase }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <div class="form-control" readonly>{{ cobranca.descricao }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Valor Original</label>
                      <div class="form-control" readonly>{{ cobranca.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Valor Pago</label>
                      <div class="form-control" readonly>
                        {{ cobranca.valorPago ? (cobranca.valorPago | currency:'BRL':'symbol':'1.2-2') : 'N/A' }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento</label>
                      <div class="form-control" readonly>{{ cobranca.dataVencimento | date:'dd/MM/yyyy' }}</div>
                    </div>
                  </div>
                </div>

                <div class="row" *ngIf="cobranca.dataPagamento">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Data de Pagamento</label>
                      <div class="form-control" readonly>{{ cobranca.dataPagamento | date:'dd/MM/yyyy' }}</div>
                    </div>
                  </div>
                </div>

                <div class="d-flex justify-content-end" *ngIf="cobranca.status === 'ABERTA'">
                  <button 
                    class="btn btn-success me-2"
                    [routerLink]="['/pages/financeiro/cobrancas-avulsas/pagamento', cobranca.id]">
                    Registrar Pagamento
                  </button>
                  <button 
                    class="btn btn-primary"
                    [routerLink]="['/pages/financeiro/cobrancas-avulsas/editar', cobranca.id]">
                    Editar
                  </button>
                </div>
              </div>
              <div class="card-body" *ngIf="!cobranca && !carregando">
                <div class="alert alert-info" role="alert">
                  Cobrança não encontrada.
                </div>
              </div>
              <div class="card-body" *ngIf="carregando">
                <div class="d-flex justify-content-center">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-aberta {
      background-color: #fff3cd;
      color: #856404;
    }
    .status-paga {
      background-color: #d4edda;
      color: #155724;
    }
    .status-cancelada {
      background-color: #f8d7da;
      color: #721c24;
    }
  `]
})
export class CobrancasAvulsasDetalhesComponent implements OnInit {

  cobranca: Cobranca | null = null;
  carregando = true;
  cobrancaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cobrancasAvulsasService: CobrancasAvulsasService
  ) { }

  ngOnInit(): void {
    this.cobrancaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.cobrancaId) {
      this.loadCobranca();
    } else {
      this.carregando = false;
    }
  }

  loadCobranca(): void {
    this.cobrancasAvulsasService.getById(this.cobrancaId!).subscribe({
      next: (data) => {
        this.cobranca = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cobrança:', error);
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/pages/financeiro/cobrancas-avulsas/lista']);
  }
}