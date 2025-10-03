import { Component, OnInit } from '@angular/core';
import { Cobranca } from './non-monthly-billing.model';
import { NonMonthlyBillingService } from './non-monthly-billing.service';

@Component({
  selector: 'app-billing-list',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Listagem de Cobranças</h4>
              </div>
              <div class="card-body">
                <!-- Filtro -->
                <div class="row g-3 mb-4">
                  <div class="col-xl-6">
                    <div class="search-box">
                      <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Filtrar cobranças..." 
                        [(ngModel)]="filtro"
                        (input)="onFiltroChange()"
                      >
                    </div>
                  </div>
                  <div class="col-xl-6 text-xl-end">
                    <button type="button" class="btn btn-primary" (click)="loadCobrancas()">
                      <i class="ri-refresh-line align-bottom me-1"></i> Atualizar
                    </button>
                  </div>
                </div>

                <!-- Tabela de cobranças -->
                <div class="table-responsive">
                  <table class="table table-nowrap table-centered align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Sócio</th>
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
                          <div>
                            <span class="fw-bold">{{ cobranca.socioNome || 'Sócio #' + cobranca.socioId }}</span>
                            <div class="small text-muted">#{{ cobranca.socioId }}</div>
                          </div>
                        </td>
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
                        <td colspan="9" class="text-center">
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border text-primary" role="status">
                              <span class="visually-hidden">Carregando...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!loading && (!cobrancas || cobrancas.length === 0)">
                        <td colspan="9" class="text-center">
                          Nenhuma cobrança encontrada.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Paginação -->
                <div class="row g-0 mt-3 align-items-center" *ngIf="!loading && page.totalElements > 0">
                  <div class="col-sm-6">
                    <div class="text-muted">
                      Mostrando <b>{{ page.number * page.size + 1 }}</b> a 
                      <b>{{ page.number * page.size + page.numberOfElements }}</b> de 
                      <b>{{ page.totalElements }}</b> resultados
                    </div>
                  </div>
                  <div class="col-sm-6">
                    <ul class="pagination pagination-separated justify-content-end mb-0">
                      <li class="page-item" [class.disabled]="currentPage === 0">
                        <a class="page-link" href="javascript:void(0)" (click)="onPageChange(currentPage - 1)">
                          Anterior
                        </a>
                      </li>
                      
                      <li class="page-item" [class.active]="currentPage === 0">
                        <a class="page-link" href="javascript:void(0)" (click)="onPageChange(0)">1</a>
                      </li>
                      
                      <!-- Exibir páginas intermediárias se necessário -->
                      <li class="page-item disabled" *ngIf="currentPage > 3">
                        <span class="page-link">...</span>
                      </li>
                      
                      <li *ngFor="let pageNr of getVisiblePages(); let i = index" 
                          class="page-item" 
                          [class.active]="currentPage === pageNr"
                          [class.disabled]="pageNr === -1">
                        <span class="page-link" *ngIf="pageNr === -1">...</span>
                        <a class="page-link" href="javascript:void(0)" (click)="onPageChange(pageNr)" *ngIf="pageNr !== -1">{{ pageNr + 1 }}</a>
                      </li>
                      
                      <li class="page-item disabled" *ngIf="currentPage < page.totalPages - 4">
                        <span class="page-link">...</span>
                      </li>
                      
                      <li class="page-item" 
                          [class.active]="currentPage === page.totalPages - 1" 
                          *ngIf="page.totalPages > 1">
                        <a class="page-link" href="javascript:void(0)" (click)="onPageChange(page.totalPages - 1)">
                          {{ page.totalPages }}
                        </a>
                      </li>
                      
                      <li class="page-item" [class.disabled]="currentPage === page.totalPages - 1">
                        <a class="page-link" href="javascript:void(0)" (click)="onPageChange(currentPage + 1)">
                          Próximo
                        </a>
                      </li>
                    </ul>
                  </div>
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
export class BillingListComponent implements OnInit {
  cobrancas: Cobranca[] = [];
  page: any = {}; // Simplified page object
  currentPage = 0;
  pageSize = 30;
  filtro = '';
  loading = false;
  error: string | null = null;

  constructor(private billingService: NonMonthlyBillingService) { }

  ngOnInit(): void {
    this.loadCobrancas();
  }

  loadCobrancas(): void {
    this.loading = true;
    this.error = null;
    
    // TODO: Implement pagination when backend supports it
    this.billingService.getNonMonthlyBillings().subscribe({
      next: (data: Cobranca[]) => {
        // Filter data based on search term
        let filteredData = data;
        if (this.filtro) {
          const termo = this.filtro.toLowerCase();
          filteredData = data.filter(cobranca => 
            (cobranca.socioNome && cobranca.socioNome.toLowerCase().includes(termo)) ||
            (cobranca.descricao && cobranca.descricao.toLowerCase().includes(termo)) ||
            (cobranca.id && cobranca.id.toString().includes(termo))
          );
        }
        
        // Simulate pagination
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.cobrancas = filteredData.slice(startIndex, endIndex);
        
        // Create mock page object for pagination display
        this.page = {
          content: this.cobrancas,
          number: this.currentPage,
          size: this.pageSize,
          numberOfElements: this.cobrancas.length,
          totalElements: filteredData.length,
          totalPages: Math.ceil(filteredData.length / this.pageSize)
        };
        
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar cobranças:', error);
        this.loading = false;
        this.error = 'Erro ao carregar cobranças: ' + (error.error?.message || 'Erro desconhecido');
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadCobrancas();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Reset to first page when filtering
    this.loadCobrancas();
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

  getVisiblePages(): number[] {
    const totalPages = this.page.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= 7) {
      // If 7 or fewer pages, show all
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Otherwise, show with abbreviation
    const pages = [];
    
    // First page always visible
    pages.push(0);
    
    if (currentPage > 3) {
      pages.push(-1); // "..." indicator
    }
    
    // Determine page range around current page
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 4) {
      pages.push(-1); // "..." indicator
    }
    
    // Last page always visible (if different from previous)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }
    
    return pages;
  }
}