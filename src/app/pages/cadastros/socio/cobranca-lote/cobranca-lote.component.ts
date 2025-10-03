import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Socio, Page } from '../socio.model';
import { SocioService } from '../socio.service';

@Component({
  selector: 'app-cobranca-lote',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Geração em Lote de Cobranças de Mensalidade</h4>
              </div>
              <div class="card-body">
                <form [formGroup]="cobrancaForm" (ngSubmit)="gerarCobrancas()">
                  <div class="row g-3">
                    <div class="col-lg-4">
                      <label for="mes" class="form-label">Mês</label>
                      <select class="form-control" id="mes" formControlName="mes" required>
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>
                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </select>
                    </div>
                    
                    <div class="col-lg-4">
                      <label for="ano" class="form-label">Ano</label>
                      <input type="number" class="form-control" id="ano" formControlName="ano" 
                             placeholder="Ex: 2025" min="2000" max="3000" required>
                    </div>
                    
                    <div class="col-lg-4 d-flex align-items-end">
                      <button type="submit" class="btn btn-primary w-100" 
                              [disabled]="cobrancaForm.invalid || !sociosSelecionados.length">
                        Gerar Cobranças
                      </button>
                    </div>
                  </div>
                </form>
                
                <!-- Filtro de sócios -->
                <div class="row g-3 mt-3">
                  <div class="col-xl-6">
                    <div class="search-box">
                      <input 
                        type="text" 
                        class="form-control" 
                        placeholder="Filtrar sócios..." 
                        [(ngModel)]="filtro"
                        (input)="onFiltroChange()"
                      >
                    </div>
                  </div>
                </div>

                <!-- Tabela de sócios -->
                <div class="table-responsive mt-3">
                  <table class="table table-nowrap table-centered align-middle mb-0">
                    <thead class="table-light">
                      <tr>
                        <th>
                          <input type="checkbox" 
                                 class="form-check-input" 
                                 (change)="selecionarTodos($event)"
                                 [checked]="socios.length > 0 && sociosSelecionados.length === socios.length">
                        </th>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CPF</th>
                        <th>Grau</th>
                        <th>Status</th>
                        <th>Data Adesão</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let socio of socios">
                        <td>
                          <input type="checkbox" 
                                 class="form-check-input" 
                                 [value]="socio.id"
                                 [checked]="isSocioSelecionado(socio.id)"
                                 (change)="alternarSelecao(socio.id)">
                        </td>
                        <td>{{ socio.id }}</td>
                        <td>{{ socio.nomeSocio }}</td>
                        <td>{{ socio.cpf }}</td>
                        <td>
                          <span class="badge bg-primary">
                            {{ getGrauSocioText(socio.grau) }}
                          </span>
                        </td>
                        <td>
                          <span class="badge" [ngClass]="getStatusBadgeClass(socio.status || '')">
                            {{ getStatusText(socio.status || '') }}
                          </span>
                        </td>
                        <td>{{ socio.dataAdesao ? (socio.dataAdesao | date:'shortDate') : '-' }}</td>
                      </tr>
                      <tr *ngIf="loading">
                        <td colspan="7" class="text-center">
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border text-primary" role="status">
                              <span class="visually-hidden">Carregando...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!loading && (!page.content || page.content.length === 0)">
                        <td colspan="7" class="text-center">
                          Nenhum sócio encontrado.
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

                <!-- Resultado da geração -->
                <div *ngIf="resultadoGeracao" class="mt-4">
                  <div class="alert alert-info">
                    <h5 class="alert-heading">Resultado da Geração em Lote</h5>
                    <p>{{ resultadoGeracao.mensagem }}</p>
                    <p class="mb-0">
                      <strong>Cobranças Geradas:</strong> {{ resultadoGeracao.cobrancasGeradas }} |
                      <strong>Cobranças Atualizadas:</strong> {{ resultadoGeracao.cobrancasAtualizadas }} |
                      <strong>Sócios Ignorados:</strong> {{ resultadoGeracao.sociosIgnorados }}
                    </p>
                    <div *ngIf="resultadoGeracao.detalhes" class="mt-2">
                      <h6>Detalhes:</h6>
                      <pre class="text-muted" style="white-space: pre-wrap;">{{ resultadoGeracao.detalhes }}</pre>
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
export class CobrancaLoteComponent implements OnInit {
  cobrancaForm: FormGroup;
  socios: Socio[] = [];
  page: Page<Socio> = {} as Page<Socio>;
  currentPage = 0;
  pageSize = 30;
  filtro = '';
  loading = false;
  sociosSelecionados: number[] = [];
  resultadoGeracao: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService
  ) {
    this.cobrancaForm = this.formBuilder.group({
      mes: [new Date().getMonth() + 1, [Validators.required, Validators.min(1), Validators.max(12)]],
      ano: [new Date().getFullYear(), [Validators.required, Validators.min(2000), Validators.max(3000)]]
    });
  }

  ngOnInit(): void {
    this.loadSocios();
  }

  loadSocios(): void {
    this.loading = true;
    this.socioService.getSocios(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Socio>) => {
          this.page = response;
          this.socios = response.content;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar sócios:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadSocios();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadSocios();
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

  getGrauSocioText(grau: string): string {
    return grau || 'Desconhecido';
  }

  getVisiblePages(): number[] {
    const totalPages = this.page.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= 7) {
      // Se tiver 7 ou menos páginas, mostrar todas
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Caso contrário, mostrar com abreviação
    const pages = [];
    
    // Primeira página sempre visível
    pages.push(0);
    
    if (currentPage > 3) {
      pages.push(-1); // Indicador de "..."
    }
    
    // Determinar o intervalo de páginas ao redor da página atual
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 4) {
      pages.push(-1); // Indicador de "..."
    }
    
    // Última página sempre visível (se for diferente da anterior)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }
    
    return pages;
  }

  selecionarTodos(event: any): void {
    if (event.target.checked) {
      this.sociosSelecionados = this.socios.map(s => s.id!).filter(id => id !== undefined) as number[];
    } else {
      this.sociosSelecionados = [];
    }
  }

  alternarSelecao(socioId: number | undefined): void {
    if (socioId === undefined) return;
    
    const index = this.sociosSelecionados.indexOf(socioId);
    if (index > -1) {
      this.sociosSelecionados.splice(index, 1);
    } else {
      this.sociosSelecionados.push(socioId);
    }
  }

  isSocioSelecionado(socioId: number | undefined): boolean {
    return socioId ? this.sociosSelecionados.includes(socioId) : false;
  }

  gerarCobrancas(): void {
    if (this.cobrancaForm.invalid || this.sociosSelecionados.length === 0) {
      return;
    }

    const { mes, ano } = this.cobrancaForm.value;

    this.socioService.gerarCobrancasMensalidade(this.sociosSelecionados, mes, ano).subscribe({
      next: (response) => {
        this.resultadoGeracao = response;
        console.log('Cobranças geradas com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao gerar cobranças:', error);
        alert('Erro ao gerar cobranças: ' + (error.error?.message || 'Erro desconhecido'));
      }
    });
  }
}