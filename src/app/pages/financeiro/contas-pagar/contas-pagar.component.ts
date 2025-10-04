import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Page, ContaPagar, Fornecedor, Rubrica, ContaFinanceira } from '../financeiro.model';
import { ContasPagarService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-contas-pagar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Contas a Pagar</h4>
                <div class="flex-shrink-0">
                  <button type="button" class="btn btn-soft-primary" (click)="novoContaPagar()">
                    <i class="ri-add-line align-bottom me-1"></i> Nova Conta
                  </button>
                  <button type="button" class="btn btn-light ms-2" (click)="carregarContasPagar()">
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
                          <th scope="col">Fornecedor</th>
                          <th scope="col">Rubrica</th>
                          <th scope="col">Descrição</th>
                          <th scope="col">Valor</th>
                          <th scope="col">Vencimento</th>
                          <th scope="col">Pagamento</th>
                          <th scope="col">Status</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let conta of contasPagar">
                          <td>{{ conta.id }}</td>
                          <td>{{ conta.fornecedorNome }}</td>
                          <td>{{ conta.rubricaNome }}</td>
                          <td>{{ conta.descricao }}</td>
                          <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                          <td>{{ conta.dataVencimento | date:'shortDate' }}</td>
                          <td>{{ conta.dataPagamento ? (conta.dataPagamento | date:'shortDate') : '-' }}</td>
                          <td>
                            <span class="badge" [ngClass]="getStatusBadgeClass(conta.status)">
                              {{ getStatusText(conta.status) }}
                            </span>
                          </td>
                          <td>
                            <div class="hstack gap-3 flex-wrap">
                              <button type="button" class="btn btn-sm btn-soft-info edit-item-btn"
                                (click)="editarContaPagar(conta.id || 0)" title="Editar">
                                <i class="ri-pencil-fill align-bottom"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-soft-danger remove-item-btn"
                                (click)="excluirContaPagar(conta.id || 0)" title="Excluir">
                                <i class="ri-delete-bin-fill align-bottom"></i>
                              </button>
                              <button type="button" class="btn btn-sm btn-soft-success"
                                *ngIf="conta.status === 'ABERTA'"
                                (click)="quitarContaPagar(conta.id || 0)" title="Quitar">
                                <i class="ri-money-dollar-circle-fill align-bottom"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="contasPagar.length === 0">
                          <td colspan="9" class="text-center">
                            Nenhuma conta a pagar encontrada
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
export class ContasPagarComponent implements OnInit {
  contasPagar: ContaPagar[] = [];
  page: Page<ContaPagar> = {} as Page<ContaPagar>;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  contasFinanceiras: ContaFinanceira[] = [];

  constructor(
    private contasPagarService: ContasPagarService,
    private dadosAuxiliaresService: DadosAuxiliaresService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.carregarContasPagar();
    this.carregarDadosAuxiliares();
  }

  carregarContasPagar(): void {
    this.contasPagarService.listarContasPagar(this.currentPage, this.pageSize).subscribe({
      next: (response: Page<ContaPagar>) => {
        this.page = response;
        this.contasPagar = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar contas a pagar:', error);
      },
    });
  }

  carregarDadosAuxiliares(): void {
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
      case 'CANCELADA': return 'Cancelada';
      default: return status;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-warning';
      case 'PAGA': return 'bg-success';
      case 'CANCELADA': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  novoContaPagar(): void {
    // Redirecionar para o formulário de nova conta a pagar
    console.log('Redirecionar para nova conta a pagar');
  }

  editarContaPagar(id: number): void {
    // Redirecionar para o formulário de edição da conta a pagar
    console.log('Editar conta a pagar:', id);
  }

  excluirContaPagar(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta conta a pagar?')) {
      console.log('Excluir conta a pagar:', id);
    }
  }

  quitarContaPagar(id: number): void {
    // Abrir modal para seleção da conta financeira
    console.log('Quitar conta a pagar:', id);
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarContasPagar();
    }
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarContasPagar();
    }
  }
}