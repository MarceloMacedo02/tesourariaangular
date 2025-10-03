import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socio } from '../../socio/socio.model';
import { SocioService } from '../../socio/socio.service';
import { Cobranca } from '../non-monthly-billing.model';
import { NonMonthlyBillingService } from '../non-monthly-billing.service';

@Component({
  selector: 'app-socio-billings',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Cobranças do Sócio: {{ socio?.nomeSocio || 'Carregando...' }}</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-secondary btn-sm" (click)="voltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
                </div>
              </div>
              <div class="card-body">
                <!-- Informações do Sócio -->
                <div class="row g-3 mb-4" *ngIf="socio">
                  <div class="col-lg-3">
                    <label class="form-label fw-bold">ID:</label>
                    <p class="mb-0">{{ socio.id }}</p>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label fw-bold">CPF:</label>
                    <p class="mb-0">{{ socio.cpf }}</p>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label fw-bold">Status:</label>
                    <p class="mb-0">
                      <span class="badge" [ngClass]="getStatusBadgeClass(socio.status || '')">
                        {{ getStatusText(socio.status || '') }}
                      </span>
                    </p>
                  </div>
                  <div class="col-lg-3">
                    <label class="form-label fw-bold">Data Adesão:</label>
                    <p class="mb-0">{{ socio.dataAdesao ? (socio.dataAdesao | date:'shortDate') : '-' }}</p>
                  </div>
                </div>

                <!-- Lista de Cobranças -->
                <div class="table-responsive mt-3">
                  <table class="table table-nowrap table-centered align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Data Vencimento</th>
                        <th>Status</th>
                        <th>Data Registro</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let cobranca of cobrancas">
                        <td>{{ cobranca.id }}</td>
                        <td>
                          <span class="badge bg-primary">
                            {{ getTipoCobrancaText(cobranca.tipoCobranca) }}
                          </span>
                        </td>
                        <td>{{ cobranca.descricao || '-' }}</td>
                        <td>{{ cobranca.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>{{ cobranca.dataVencimento ? (cobranca.dataVencimento | date:'shortDate') : '-' }}</td>
                        <td>
                          <span class="badge" [ngClass]="getStatusCobrancaBadgeClass(cobranca.status)">
                            {{ getStatusCobrancaText(cobranca.status) }}
                          </span>
                        </td>
                        <td>{{ cobranca.dataRegistro ? (cobranca.dataRegistro | date:'shortDate') : '-' }}</td>
                        <td>
                          <ul class="list-inline mb-0">
                            <li class="list-inline-item">
                              <button type="button" class="btn btn-soft-primary btn-sm" title="Visualizar Cobrança">
                                <i class="ri-eye-fill align-bottom"></i>
                              </button>
                            </li>
                          </ul>
                        </td>
                      </tr>
                      <tr *ngIf="loading">
                        <td colspan="8" class="text-center">
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border text-primary" role="status">
                              <span class="visually-hidden">Carregando...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!loading && (!cobrancas || cobrancas.length === 0)">
                        <td colspan="8" class="text-center">
                          Nenhuma cobrança encontrada para este sócio.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Erro de carregamento -->
                <div *ngIf="error" class="mt-4">
                  <div class="alert alert-danger">
                    <h5 class="alert-heading">Erro</h5>
                    <p>{{ error }}</p>
                  </div>
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
export class SocioBillingsComponent implements OnInit {
  socio: Socio | null = null;
  cobrancas: Cobranca[] = [];
  loading = false;
  error: string | null = null;
  socioId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private socioService: SocioService,
    private billingService: NonMonthlyBillingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.socioId = +params['id'];
      if (this.socioId) {
        this.loadSocio();
        this.loadCobrancas();
      }
    });
  }

  loadSocio(): void {
    if (!this.socioId) return;
    
    this.socioService.getSocioById(this.socioId).subscribe({
      next: (data: Socio) => {
        this.socio = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar sócio:', error);
        this.error = 'Erro ao carregar informações do sócio: ' + (error.error?.message || 'Erro desconhecido');
      }
    });
  }

  loadCobrancas(): void {
    if (!this.socioId) return;
    
    this.loading = true;
    this.error = null;
    
    this.billingService.getBillingsBySocioId(this.socioId).subscribe({
      next: (data: Cobranca[]) => {
        this.cobrancas = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar cobranças:', error);
        this.loading = false;
        this.error = 'Erro ao carregar cobranças: ' + (error.error?.message || 'Erro desconhecido');
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/pages/cadastros/socio/lista']);
  }

  getStatusText(status: string): string {
    return status || 'Desconhecido';
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'ativo':
      case 'frequente':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getTipoCobrancaText(tipo: string): string {
    switch(tipo) {
      case 'MENSALIDADE':
        return 'Mensalidade';
      case 'NAO_MENSALIDADE':
        return 'Não Mensalidade';
      case 'OUTRAS_RUBRICAS':
        return 'Outras Rubricas';
      default:
        return tipo || 'Desconhecido';
    }
  }

  getStatusCobrancaText(status: string): string {
    switch(status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'PAGO':
        return 'Pago';
      case 'CANCELADO':
        return 'Cancelado';
      case 'ABERTA':
        return 'Aberta';
      default:
        return status || 'Desconhecido';
    }
  }

  getStatusCobrancaBadgeClass(status: string): string {
    switch(status) {
      case 'PENDENTE':
        return 'bg-warning';
      case 'PAGO':
        return 'bg-success';
      case 'CANCELADO':
        return 'bg-danger';
      case 'ABERTA':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }
}