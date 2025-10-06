import { Component, OnInit } from '@angular/core';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoResponse } from '../../../models/transacao-response.model';
import { TransacaoDto as OriginalTransacaoDto } from '../../../models/transacao-ofx.model';

@Component({
  selector: 'app-review-transacoes',
  template: `
    <div class="page-content">
      <!-- Start Breadcrumbs -->
      <app-breadcrumbs [title]="'Review de Transações'" [breadcrumbItems]="breadCrumbItems"></app-breadcrumbs>
      <!-- End Breadcrumbs -->

      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Review de Transações</h4>
              </div>
              <div class="card-body">
                <!-- Erros de validação -->
                <div *ngIf="errors.length > 0" class="alert alert-danger">
                  <ul class="mb-0">
                    <li *ngFor="let error of errors">{{ error }}</li>
                  </ul>
                </div>
                
                <!-- Resumo de transações -->
                <div class="row mb-4">
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">{{ totalTransacoes }}</h5>
                        <p class="card-text">Total</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">{{ totalReceitas }}</h5>
                        <p class="card-text text-success">Receitas</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">{{ totalDespesas }}</h5>
                        <p class="card-text text-danger">Despesas</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="card text-center">
                      <div class="card-body">
                        <h5 class="card-title">{{ totalPendentes }}</h5>
                        <p class="card-text text-warning">Pendentes</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Filtros -->
                <div class="row mb-4">
                  <div class="col-md-3">
                    <label for="ano" class="form-label">Ano</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      id="ano"
                      [(ngModel)]="anoFiltro"
                      placeholder="Ex: 2025">
                  </div>
                  <div class="col-md-3">
                    <label for="mes" class="form-label">Mês</label>
                    <select 
                      class="form-select" 
                      id="mes"
                      [(ngModel)]="mesFiltro">
                      <option value="">Selecione</option>
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
                  <div class="col-md-3">
                    <label for="tamanhoPagina" class="form-label">Tamanho da Página</label>
                    <select 
                      class="form-select" 
                      id="tamanhoPagina"
                      [(ngModel)]="tamanhoPagina"
                      (change)="carregarTransacoes(0)">
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                  <div class="col-md-3 align-self-end">
                    <button 
                      type="button" 
                      class="btn btn-primary w-100" 
                      (click)="aplicarFiltros()"
                      [disabled]="carregando">
                      <span *ngIf="carregando" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Filtrar
                    </button>
                  </div>
                </div>

                <!-- Tabela de transações -->
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Documento</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Origem/Destino</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let transacao of transacoesFiltradas; trackBy: trackByFn">
                        <td>{{ transacao.data | date:'dd/MM/yyyy' }}</td>
                        <td>{{ transacao.documento }}</td>
                        <td>{{ transacao.descricao }}</td>
                        <td>{{ transacao.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>
                          <span class="badge" [ngClass]="getTipoClasse(transacao.tipo)">
                            {{ transacao.tipo === 'CREDITO' ? 'Receita' : 'Despesa' }}
                          </span>
                        </td>
                        <td>
                          <span *ngIf="transacao.fornecedorOuSocio; else semRelacionamento">
                            {{ transacao.fornecedorOuSocio }}
                          </span>
                          <ng-template #semRelacionamento>
                            <span class="text-muted">Não identificado</span>
                          </ng-template>
                        </td>
                        <td>
                          <span class="badge" [ngClass]="getStatusClasse(transacao.lancado)">
                            {{ getStatusTexto(transacao.lancado) }}
                          </span>
                        </td>
                        <td>
                          <div class="hstack gap-2">
                            <button 
                              class="btn btn-soft-info btn-sm"
                              (click)="detalhesTransacao(transacao)">
                              <i class="ri-eye-fill align-bottom"></i>
                            </button>
                            <button 
                              *ngIf="transacao.lancado !== 'LANCADO'"
                              class="btn btn-soft-warning btn-sm"
                              (click)="editarTransacao(transacao)">
                              <i class="ri-pencil-fill align-bottom"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Paginação -->
                <nav aria-label="Navegação de páginas" class="mt-4" *ngIf="totalPages > 1">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" [class.disabled]="primeiraPagina">
                      <a class="page-link" href="javascript:void(0)" (click)="paginaAnterior()" [class.disabled]="primeiraPagina">Anterior</a>
                    </li>
                    
                    <li class="page-item" [class.active]="paginaAtual === i" *ngFor="let i of getRange(totalPages)">
                      <a class="page-link" href="javascript:void(0)" (click)="irParaPagina(i)">{{ i + 1 }}</a>
                    </li>
                    
                    <li class="page-item" [class.disabled]="ultimaPagina">
                      <a class="page-link" href="javascript:void(0)" (click)="proximaPagina()" [class.disabled]="ultimaPagina">Próxima</a>
                    </li>
                  </ul>
                  
                  <div class="text-center mt-2">
                    Página {{ paginaAtual + 1 }} de {{ totalPages }} ({{ totalElementos }} registros)
                  </div>
                </nav>
                
                <div *ngIf="transacoesFiltradas.length === 0 && !carregando" class="text-center py-4">
                  <i class="ri-bank-card-2-line display-4 text-muted"></i>
                  <h5 class="mt-3">Nenhuma transação encontrada</h5>
                  <p class="text-muted">Não há transações correspondentes aos filtros aplicados.</p>
                </div>
                
                <div *ngIf="carregando" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
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
  styles: []
})
export class ReviewTransacoesComponent implements OnInit {
  transacoes: OriginalTransacaoDto[] = [];
  transacoesFiltradas: OriginalTransacaoDto[] = [];
  carregando = false;
  
  // Filtros
  anoFiltro: number | null = null;
  mesFiltro: number | null = null;
  tipoFiltro: string | null = null;
  
  // Erros de validação
  errors: string[] = [];
  
  // Paginação
  paginaAtual = 0;
  tamanhoPagina = 10;
  totalElementos = 0;
  totalPages = 0;
  primeiraPagina = true;
  ultimaPagina = true;
  
  // Resumo
  totalTransacoes = 0;
  totalReceitas = 0;
  totalDespesas = 0;
  totalPendentes = 0;
  
  // Breadcrumbs
  breadCrumbItems!: Array<{}>;

  constructor(private transacoesOfxService: TransacoesOfxService) {}

  ngOnInit(): void {
    // Initialize breadcrumbs
    this.breadCrumbItems = [
      { label: 'Financeiro' }, 
      { label: 'Review de Transações', active: true }
    ];
    
    // Do not load data on page initialization - only when user clicks the filter button
    // this.carregarTransacoes(); // Removed to prevent loading on init
  }

  carregarTransacoes(page: number = 0): void {
    // Limpar erros anteriores
    this.errors = [];
    
    if (!this.anoFiltro) {
      this.errors.push('Ano é obrigatório');
    }
    
    if (!this.mesFiltro) {
      this.errors.push('Mês é obrigatório');
    }
    
    if (this.errors.length > 0) {
      return;
    }
    
    this.carregando = true;
    
    // Carregar transações por mês e ano com paginação
    this.transacoesOfxService.getTransacoesPorMesAno(
      this.anoFiltro!, 
      this.mesFiltro!, 
      page, 
      this.tamanhoPagina
    ).subscribe({
      next: (response: TransacaoResponse) => {
        // Converter os dados da resposta para o formato compatível com o modelo original
        this.transacoes = response.content.map(transacao => ({
          ...transacao,
          lancado: transacao.lancado as 'LANCADO' | 'NAOLANCADO', // Forçar o tipo compatível
          manualSelectionNeeded: transacao.manualSelectionNeeded ?? false // Adicionar campo se não existir
        } as OriginalTransacaoDto));
        
        this.transacoesFiltradas = [...this.transacoes];
        this.calcularResumo();
        
        // Atualizar informações de paginação
        this.paginaAtual = response.pageable.pageNumber;
        this.tamanhoPagina = response.pageable.pageSize;
        this.totalElementos = response.totalElements;
        this.totalPages = response.totalPages;
        this.primeiraPagina = response.first;
        this.ultimaPagina = response.last;
        
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar transações:', error);
        this.errors.push('Erro ao carregar transações. Por favor, tente novamente.');
        this.carregando = false;
      }
    });
  }

  calcularResumo(): void {
    this.totalTransacoes = this.transacoes.length;
    this.totalReceitas = this.transacoes.filter(t => t.tipo === 'CREDITO').length;
    this.totalDespesas = this.transacoes.filter(t => t.tipo === 'DEBITO').length;
    this.totalPendentes = this.transacoes.filter(t => t.lancado !== 'LANCADO').length;
  }

  aplicarFiltros(): void {
    // Reiniciar para a primeira página ao aplicar filtros
    this.carregarTransacoes(0);
  }

  // Navegar para uma página específica
  irParaPagina(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.carregarTransacoes(page);
    }
  }

  // Navegar para próxima página
  proximaPagina(): void {
    if (!this.ultimaPagina) {
      this.irParaPagina(this.paginaAtual + 1);
    }
  }

  // Navegar para página anterior
  paginaAnterior(): void {
    if (!this.primeiraPagina) {
      this.irParaPagina(this.paginaAtual - 1);
    }
  }

  trackByFn(index: number, item: OriginalTransacaoDto): number {
    return item.id;
  }

  getTipoClasse(tipo: string): string {
    return tipo === 'CREDITO' ? 'bg-success' : 'bg-danger';
  }

  getStatusClasse(lancado: string): string {
    return lancado === 'LANCADO' ? 'bg-success' : 'bg-warning';
  }

  getStatusTexto(lancado: string): string {
    return lancado === 'LANCADO' ? 'Lançado' : 'Pendente';
  }

  detalhesTransacao(transacao: OriginalTransacaoDto): void {
    // Implementar navegação para detalhes da transação
    console.log('Detalhes da transação:', transacao);
  }

  editarTransacao(transacao: OriginalTransacaoDto): void {
    // Implementar edição da transação
    console.log('Editar transação:', transacao);
  }
  
  getRange(total: number): number[] {
    return Array(total).fill(0).map((x, i) => i);
  }
}