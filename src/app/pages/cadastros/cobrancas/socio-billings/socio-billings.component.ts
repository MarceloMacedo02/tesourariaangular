import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cobranca } from '../non-monthly-billing.model';
import { NonMonthlyBillingService } from '../non-monthly-billing.service';
import { SocioService } from '../../socio/socio.service';
import { Socio } from '../../socio/socio.model';

@Component({
  selector: 'app-socio-billings',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Cobranças do Sócio</h4>
              </div>
              <div class="card-body">
                <!-- Informações do Sócio -->
                <div class="row mb-4" *ngIf="socio">
                  <div class="col-md-12">
                    <h5>Informações do Sócio</h5>
                    <div class="d-flex flex-wrap gap-3">
                      <div><strong>Nome:</strong> {{ socio.nomeSocio }}</div>
                      <div><strong>CPF:</strong> {{ socio.cpf }}</div>
                      <div><strong>Grau:</strong> {{ socio.grau }}</div>
                      <div><strong>Status:</strong> 
                        <span class="badge" [ngClass]="getStatusBadgeClass(socio.status || '')">
                          {{ getStatusText(socio.status || '') }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Carregando -->
                <div *ngIf="loading" class="d-flex justify-content-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                </div>

                <!-- Cobranças em Aberto -->
                <div class="row mb-5" *ngIf="!loading">
                  <div class="col-md-12">
                    <h5>Cobranças em Aberto</h5>
                    <div class="table-responsive">
                      <table class="table table-striped table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Rubrica</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Data Vencimento</th>
                            <th scope="col">Tipo Cobrança</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let cobranca of cobrancasAbertas">
                            <td>{{ cobranca.id }}</td>
                            <td>{{ cobranca.descricao }}</td>
                            <td>{{ cobranca.rubricaNome || 'N/A' }}</td>
                            <td>{{ cobranca.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                            <td>{{ cobranca.dataVencimento | date:'shortDate' }}</td>
                            <td>{{ cobranca.tipoCobranca }}</td>
                            <td>
                              <span class="badge bg-warning">{{ cobranca.status }}</span>
                            </td>
                          </tr>
                          <tr *ngIf="cobrancasAbertas.length === 0">
                            <td colspan="7" class="text-center">Nenhuma cobrança em aberto encontrada</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <!-- Cobranças Quitadas -->
                <div class="row" *ngIf="!loading">
                  <div class="col-md-12">
                    <h5>Cobranças Quitadas</h5>
                    <div class="table-responsive">
                      <table class="table table-striped table-nowrap align-middle mb-0">
                        <thead>
                          <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Descrição</th>
                            <th scope="col">Rubrica</th>
                            <th scope="col">Valor</th>
                            <th scope="col">Data Vencimento</th>
                            <th scope="col">Data Pagamento</th>
                            <th scope="col">Tipo Cobrança</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let cobranca of cobrancasQuitadas">
                            <td>{{ cobranca.id }}</td>
                            <td>{{ cobranca.descricao }}</td>
                            <td>{{ cobranca.rubricaNome || 'N/A' }}</td>
                            <td>{{ cobranca.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                            <td>{{ cobranca.dataVencimento | date:'shortDate' }}</td>
                            <td>{{ cobranca.dataPagamento ? (cobranca.dataPagamento | date:'shortDate') : 'N/A' }}</td>
                            <td>{{ cobranca.tipoCobranca }}</td>
                            <td>
                              <span class="badge bg-success">{{ cobranca.status }}</span>
                            </td>
                          </tr>
                          <tr *ngIf="cobrancasQuitadas.length === 0">
                            <td colspan="8" class="text-center">Nenhuma cobrança quitada encontrada</td>
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
      </div>
    </div>
  `,
  styles: []
})
export class SocioBillingsComponent implements OnInit {
  socioId: number | null = null;
  socio: Socio | null = null;
  cobrancasAbertas: Cobranca[] = [];
  cobrancasQuitadas: Cobranca[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private billingService: NonMonthlyBillingService,
    private socioService: SocioService
  ) { }

  ngOnInit(): void {
    this.socioId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.socioId) {
      this.carregarDados();
    }
  }

  carregarDados(): void {
    this.loading = true;

    // Carregar informações do sócio
    this.socioService.getSocioById(this.socioId!).subscribe({
      next: (socio) => {
        this.socio = socio;
      },
      error: (error) => {
        console.error('Erro ao carregar informações do sócio:', error);
      }
    });

    // Carregar cobranças em aberto
    this.billingService.getBillingsBySocioIdAndStatus(this.socioId!, 'ABERTA').subscribe({
      next: (cobrancas) => {
        this.cobrancasAbertas = cobrancas;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças abertas:', error);
      }
    });

    // Carregar cobranças quitadas
    this.billingService.getBillingsBySocioIdAndStatus(this.socioId!, 'PAGO').subscribe({
      next: (cobrancas) => {
        this.cobrancasQuitadas = cobrancas;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças quitadas:', error);
      }
    });

    // Carregar todas as cobranças do sócio como fallback
    this.billingService.getBillingsBySocioId(this.socioId!).subscribe({
      next: (cobrancas) => {
        this.cobrancasAbertas = cobrancas.filter(c => c.status === 'ABERTA' || c.status === 'PENDENTE');
        this.cobrancasQuitadas = cobrancas.filter(c => c.status === 'PAGO');
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças do sócio:', error);
        this.loading = false;
      }
    });
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'Ativo';
      case 'inativo':
        return 'Inativo';
      default:
        return status || 'Desconhecido';
    }
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'ativo':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }
}