import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Socio, Page } from '../../socio/socio.model';
import { Rubrica } from '../../rubricas/rubricas.model';
import { SocioService } from '../../socio/socio.service';
import { RubricasService } from '../../rubricas/rubricas.service';
import { NonMonthlyBillingService } from '../non-monthly-billing.service';
import { Cobranca, BatchBillingRequest } from '../non-monthly-billing.model';

@Component({
  selector: 'app-non-monthly-billing-batch',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Geração em Lote de Cobranças Outras Rubricas</h4>
              </div>
              <div class="card-body">
                <!-- Formulário para dados da cobrança -->
                <form [formGroup]="billingForm" (ngSubmit)="generateBatchBillings()">
                  <div class="row g-3 mb-4">
                    <div class="col-lg-6">
                      <label for="rubricaId" class="form-label">Rubrica *</label>
                      <ng-select 
                        [(ngModel)]="selectedRubricaId"
                        [disabled]="loadingRubricas"
                        [clearable]="false"
                        [searchable]="true"
                        [closeOnSelect]="true"
                        placeholder="Selecione uma rubrica"
                        [items]="rubricas"
                        bindValue="id"
                        bindLabel="nome"
                        (change)="onRubricaChange($event)">
                      </ng-select>
                      <div *ngIf="!selectedRubricaId && billingForm.get('rubricaId')?.touched" 
                           class="text-danger mt-1">
                        Rubrica é obrigatória
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="descricao" class="form-label">Descrição *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="descricao" 
                        formControlName="descricao" 
                        placeholder="Descrição da cobrança"
                        required>
                      <div *ngIf="billingForm.get('descricao')?.invalid && billingForm.get('descricao')?.touched" 
                           class="text-danger mt-1">
                        Descrição é obrigatória
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="valor" class="form-label">Valor *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="valor"
                        formControlName="valor"
                        [disabled]="loading"
                        required
                        placeholder="R$ 0,00"
                        [currencyMask]="{ prefix: 'R$ ', thousands: '.', decimal: ',', allowNegative: false, nullable: true, precision: 2 }">
                      <div *ngIf="billingForm.get('valor')?.invalid && billingForm.get('valor')?.touched" 
                           class="text-danger mt-1">
                        Valor é obrigatório e deve ser maior que zero
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="dataVencimento" class="form-label">Data de Vencimento *</label>
                      <input 
                        type="text"
                        class="form-control"
                        id="dataVencimento"
                        formControlName="dataVencimento"
                        [disabled]="loading"
                        placeholder="dd/mm/aaaa"
                        mwlFlatpickr
                        [altInput]="true"
                        [convertModelValue]="true"
                        [dateFormat]="'Y-m-d'"
                        altFormat="d/m/Y">
                      <div *ngIf="billingForm.get('dataVencimento')?.invalid && billingForm.get('dataVencimento')?.touched" 
                           class="text-danger mt-1">
                        Data de vencimento é obrigatória
                      </div>
                    </div>

                    <div class="col-12">
                      <button 
                        type="submit" 
                        class="btn btn-primary w-100" 
                        [disabled]="billingForm.invalid || !sociosSelecionados.length || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {{ loading ? 'Gerando Cobranças...' : 'Gerar Cobranças em Lote de Outras Rubricas' }}
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
                      <tr *ngIf="loadingSocios">
                        <td colspan="7" class="text-center">
                          <div class="d-flex justify-content-center">
                            <div class="spinner-border text-primary" role="status">
                              <span class="visually-hidden">Carregando...</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr *ngIf="!loadingSocios && (!page.content || page.content.length === 0)">
                        <td colspan="7" class="text-center">
                          Nenhum sócio encontrado.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Paginação -->
                <div class="row g-0 mt-3 align-items-center" *ngIf="!loadingSocios && page.totalElements > 0">
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
                  <div class="alert" [class.alert-success]="!erroGeracao" [class.alert-danger]="erroGeracao">
                    <h5 class="alert-heading">{{ erroGeracao ? 'Erro' : 'Sucesso' }}</h5>
                    <p>{{ resultadoGeracao }}</p>
                    <div *ngIf="!erroGeracao" class="mt-2">
                      <p class="mb-0">
                        <strong>Cobranças Geradas:</strong> {{ cobrancasGeradas }} |
                        <strong>Cobranças Atualizadas:</strong> {{ cobrancasAtualizadas }} |
                        <strong>Sócios Ignorados:</strong> {{ sociosIgnorados }}
                      </p>
                      <div *ngIf="detalhes && detalhes.length > 0" class="mt-2">
                        <h6>Detalhes:</h6>
                        <pre class="text-muted" style="white-space: pre-wrap;">{{ detalhes }}</pre>
                      </div>
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
export class NonMonthlyBillingBatchComponent implements OnInit {
  billingForm: FormGroup;
  socios: Socio[] = [];
  rubricas: Rubrica[] = [];
  selectedRubricaId: number | null = null;
  page: Page<Socio> = {} as Page<Socio>;
  currentPage = 0;
  pageSize = 30;
  filtro = '';
  loadingSocios = false;
  loadingRubricas = false;
  loading = false;
  sociosSelecionados: number[] = [];
  resultadoGeracao: string | null = null;
  erroGeracao = false;
  cobrancasGeradas = 0;
  cobrancasAtualizadas = 0;
  sociosIgnorados = 0;
  detalhes: string[] | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService,
    private rubricaService: RubricasService,
    private billingService: NonMonthlyBillingService,
    private router: Router
  ) {
    this.billingForm = this.formBuilder.group({
      rubricaId: ['', [Validators.required]],
      descricao: ['', [Validators.required, Validators.minLength(3)]],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadSocios();
    this.loadRubricas();
  }

  loadSocios(): void {
    this.loadingSocios = true;
    this.socioService.getSocios(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Socio>) => {
          this.page = response;
          this.socios = response.content;
          this.loadingSocios = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar sócios:', error);
          this.loadingSocios = false;
        }
      });
  }

  loadRubricas(): void {
    this.loadingRubricas = true;
    this.rubricaService.getRubricas(0, 1000).subscribe({
      next: (response) => {
        this.rubricas = response.content;
        this.loadingRubricas = false;
      },
      error: (error) => {
        console.error('Erro ao carregar rubricas:', error);
        this.loadingRubricas = false;
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

  onRubricaChange(event: any): void {
    this.selectedRubricaId = event?.id || null;
    console.log('Rubrica selecionada:', event, 'selectedRubricaId:', this.selectedRubricaId);
    
    // Atualizar o valor do form control também
    this.billingForm.get('rubricaId')?.setValue(this.selectedRubricaId || '');
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

  generateBatchBillings(): void {
    // Atualizar o valor do form control com o valor do ng-select
    this.billingForm.get('rubricaId')?.setValue(this.selectedRubricaId);
    
    // Verificar se o ng-select tem valor selecionado
    if (this.billingForm.invalid || this.sociosSelecionados.length === 0 || !this.selectedRubricaId) {
      // Marcar campos como tocados para exibir erros de validação
      this.billingForm.markAllAsTouched();
      
      // Verificar se rubrica não está selecionada
      if (!this.selectedRubricaId) {
        this.billingForm.get('rubricaId')?.setErrors({ required: true });
      }
      
      if (this.sociosSelecionados.length === 0) {
        this.resultadoGeracao = 'Selecione pelo menos um sócio para gerar cobranças';
        this.erroGeracao = true;
      }
      return;
    }

    const formData = this.billingForm.value;

    // Prepare the request object for OUTRAS_RUBRICAS batch billing
    const request: BatchBillingRequest = {
      sociosIds: this.sociosSelecionados,
      rubricaId: this.selectedRubricaId,
      valor: formData.valor,
      dataVencimento: formData.dataVencimento,
      descricao: formData.descricao
    };

    this.loading = true;
    this.resultadoGeracao = null;
    this.erroGeracao = false;

    this.billingService.createBatchOutrasRubricasBillings(request).subscribe({
      next: (response) => {
        this.loading = false;
        this.cobrancasGeradas = response.cobrancasGeradas;
        this.cobrancasAtualizadas = response.cobrancasAtualizadas;
        this.sociosIgnorados = response.sociosIgnorados;
        this.detalhes = response.detalhes || [];
        this.resultadoGeracao = response.mensagem;
        this.erroGeracao = false;
        
        // Clear form and selection after successful creation
        this.billingForm.reset();
        this.sociosSelecionados = [];
        
        // Clear the validation errors
        Object.keys(this.billingForm.controls).forEach(key => {
          this.billingForm.get(key)?.setErrors(null);
        });
        
        setTimeout(() => {
          this.router.navigate(['/pages/cadastros/cobrancas/lista']); // Redirect to billing list after success
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.erroGeracao = true;
        this.resultadoGeracao = `Erro ao gerar cobranças: ${error.error?.message || 'Erro desconhecido'}`;
        console.error('Erro ao gerar cobranças em lote:', error);
      }
    });
  }
}