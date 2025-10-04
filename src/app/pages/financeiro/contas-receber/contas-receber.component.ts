import { Component, OnInit } from '@angular/core';
import { Page, CobrancaAvulsa, Socio, Fornecedor, Rubrica, GrupoMensalidade, ContaFinanceira } from '../financeiro.model';
import { ContasReceberService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-contas-receber',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas a Receber</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-primary" (click)="novaCobranca()">
                    <i class="ri-add-line align-bottom me-1"></i> Nova Cobrança
                  </button>
                  <button type="button" class="btn btn-light ms-2" (click)="carregarCobrancas()">
                    <i class="ri-refresh-line align-bottom"></i>
                  </button>
                </div>
              </div>
              <div class="card-body">
                <div class="live-preview">
                  <div class="table-responsive">
                    <table class="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Cliente</th>
                          <th scope="col">Rubrica</th>
                          <th scope="col">Descrição</th>
                          <th scope="col">Valor Original</th>
                          <th scope="col">Valor Pago</th>
                          <th scope="col">Vencimento</th>
                          <th scope="col">Pagamento</th>
                          <th scope="col">Status</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let cobranca of cobrancas">
                          <td>{{ cobranca.id }}</td>
                          <td>
                            <span *ngIf="cobranca.socioNome">{{ cobranca.socioNome }}</span>
                            <span *ngIf="cobranca.fornecedorNome">{{ cobranca.fornecedorNome }}</span>
                          </td>
                          <td>{{ cobranca.rubricaNome }}</td>
                          <td>{{ cobranca.descricao }}</td>
                          <td>{{ cobranca.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</td>
                          <td>{{ cobranca.valorPago ? (cobranca.valorPago | currency:'BRL':'symbol':'1.2-2') : '-' }}</td>
                          <td>{{ cobranca.dataVencimento | date:'shortDate' }}</td>
                          <td>{{ cobranca.dataPagamento ? (cobranca.dataPagamento | date:'shortDate') : '-' }}</td>
                          <td>
                            <span class="badge" [ngClass]="getStatusBadgeClass(cobranca.status)">
                              {{ getStatusText(cobranca.status) }}
                            </span>
                          </td>
                          <td>
                            <div class="hstack gap-3 flex-wrap">
                              <button type="button" class="btn btn-sm btn-soft-info edit-item-btn"
                                (click)="editarCobranca(cobranca.id || 0)" title="Editar">
                                <i class="ri-pencil-fill align-bottom"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-soft-danger remove-item-btn"
                                (click)="excluirCobranca(cobranca.id || 0)" title="Excluir">
                                <i class="ri-delete-bin-fill align-bottom"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-soft-success"
                                *ngIf="cobranca.status === 'ABERTA' || cobranca.status === 'VENCIDA'"
                                (click)="quitarCobranca(cobranca.id || 0)" title="Quitar">
                                <i class="ri-money-dollar-circle-fill align-bottom"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="cobrancas.length === 0">
                          <td colspan="10" class="text-center">
                            Nenhuma cobrança encontrada
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4">
                  <div>Página {{ currentPage + 1 }} de {{ totalPages }}</div>
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-primary" [disabled]="currentPage === 0"
                      (click)="paginaAnterior()">
                      Anterior
                    </button>
                    <button type="button" class="btn btn-primary"
                      [disabled]="currentPage === totalPages - 1" (click)="proximaPagina()">
                      Próxima
                    </button>
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
export class ContasReceberComponent implements OnInit {
  cobrancas: CobrancaAvulsa[] = [];
  page: Page<CobrancaAvulsa> = {} as Page<CobrancaAvulsa>;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  socios: Socio[] = [];
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  gruposMensalidade: GrupoMensalidade[] = [];
  contasFinanceiras: ContaFinanceira[] = [];

  constructor(
    private contasReceberService: ContasReceberService,
    private dadosAuxiliaresService: DadosAuxiliaresService
  ) {}

  ngOnInit(): void {
    this.carregarCobrancas();
    this.carregarDadosAuxiliares();
  }

  carregarCobrancas(): void {
    this.contasReceberService.listarCobrancas(this.currentPage, this.pageSize).subscribe({
      next: (response: Page<CobrancaAvulsa>) => {
        this.page = response;
        this.cobrancas = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar cobranças:', error);
      },
    });
  }

  carregarDadosAuxiliares(): void {
    this.dadosAuxiliaresService.getSociosAtivos().subscribe({
      next: (socios: Socio[]) => {
        this.socios = socios;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
      }
    });

    this.dadosAuxiliaresService.getFornecedoresAtivos().subscribe({
      next: (fornecedores: Fornecedor[]) => {
        this.fornecedores = fornecedores;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    });

    this.dadosAuxiliaresService.getRubricas().subscribe({
      next: (rubricas: Rubrica[]) => {
        this.rubricas = rubricas;
      },
      error: (error) => {
        console.error('Erro ao carregar rubricas:', error);
      }
    });

    this.dadosAuxiliaresService.getGruposMensalidade().subscribe({
      next: (grupos: GrupoMensalidade[]) => {
        this.gruposMensalidade = grupos;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos de mensalidade:', error);
      }
    });

    this.dadosAuxiliaresService.getContasFinanceiras().subscribe({
      next: (contas: ContaFinanceira[]) => {
        this.contasFinanceiras = contas;
      },
      error: (error) => {
        console.error('Erro ao carregar contas financeiras:', error);
      }
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ABERTA': return 'Aberta';
      case 'PAGA': return 'Paga';
      case 'VENCIDA': return 'Vencida';
      case 'CANCELADA': return 'Cancelada';
      case 'QUITADA': return 'Quitada';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-warning';
      case 'PAGA': return 'bg-success';
      case 'VENCIDA': return 'bg-danger';
      case 'CANCELADA': return 'bg-secondary';
      case 'QUITADA': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  novaCobranca(): void {
    // Redirecionar para o formulário de nova cobrança
    console.log('Redirecionar para nova cobrança');
  }

  editarCobranca(id: number): void {
    // Redirecionar para o formulário de edição da cobrança
    console.log('Editar cobrança:', id);
  }

  excluirCobranca(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta cobrança?')) {
      console.log('Excluir cobrança:', id);
    }
  }

  quitarCobranca(id: number): void {
    // Abrir modal para seleção da conta financeira
    console.log('Quitar cobrança:', id);
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarCobrancas();
    }
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarCobrancas();
    }
  }
}