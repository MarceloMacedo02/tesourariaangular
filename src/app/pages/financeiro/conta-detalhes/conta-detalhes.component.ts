import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContaPagar, CobrancaAvulsa, Socio, Fornecedor, Rubrica } from '../financeiro.model';
import { ContasPagarService, ContasReceberService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-conta-detalhes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">
                  {{ contaPagar ? 'Detalhes da Conta a Pagar' : 'Detalhes da Cobrança' }}
                </h4>
              </div>
              <div class="card-body">
                <div *ngIf="contaPagar; else mostrarCobranca" class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">ID:</label>
                      <p class="form-control-plaintext">{{ contaPagar.id }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Fornecedor:</label>
                      <p class="form-control-plaintext">{{ getFornecedorNome(contaPagar.fornecedorId) }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Rubrica:</label>
                      <p class="form-control-plaintext">{{ getRubricaNome(contaPagar.rubricaId) }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Descrição:</label>
                      <p class="form-control-plaintext">{{ contaPagar.descricao }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Valor:</label>
                      <p class="form-control-plaintext">{{ contaPagar.valor | currency:'BRL':'symbol':'1.2-2' }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento:</label>
                      <p class="form-control-plaintext">{{ contaPagar.dataVencimento | date:'shortDate' }}</p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Data de Pagamento:</label>
                      <p class="form-control-plaintext">
                        {{ contaPagar.dataPagamento ? (contaPagar.dataPagamento | date:'shortDate') : '-' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label">Status:</label>
                      <p class="form-control-plaintext">
                        <span class="badge" [ngClass]="getStatusBadgeClass(contaPagar.status)">
                          {{ getStatusText(contaPagar.status) }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <ng-template #mostrarCobranca>
                  <div *ngIf="cobranca" class="row">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">ID:</label>
                        <p class="form-control-plaintext">{{ cobranca.id }}</p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Cliente:</label>
                        <p class="form-control-plaintext">
                          {{ cobranca.socioNome || cobranca.fornecedorNome || 'Não informado' }}
                        </p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Rubrica:</label>
                        <p class="form-control-plaintext">{{ getRubricaNome(cobranca.rubricaId) }}</p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Descrição:</label>
                        <p class="form-control-plaintext">{{ cobranca.descricao }}</p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Valor Original:</label>
                        <p class="form-control-plaintext">{{ cobranca.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Valor Pago:</label>
                        <p class="form-control-plaintext">
                          {{ cobranca.valorPago ? (cobranca.valorPago | currency:'BRL':'symbol':'1.2-2') : '-' }}
                        </p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Data de Vencimento:</label>
                        <p class="form-control-plaintext">{{ cobranca.dataVencimento | date:'shortDate' }}</p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Data de Pagamento:</label>
                        <p class="form-control-plaintext">
                          {{ cobranca.dataPagamento ? (cobranca.dataPagamento | date:'shortDate') : '-' }}
                        </p>
                      </div>
                    </div>
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label class="form-label">Status:</label>
                        <p class="form-control-plaintext">
                          <span class="badge" [ngClass]="getStatusBadgeClass(cobranca.status)">
                            {{ getStatusText(cobranca.status) }}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </ng-template>
                
                <div class="d-flex gap-2">
                  <button type="button" class="btn btn-light" (click)="voltar()">
                    Voltar
                  </button>
                  <button type="button" class="btn btn-primary" (click)="editar()" *ngIf="contaPagar || cobranca">
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContaDetalhesComponent implements OnInit {
  contaPagar: ContaPagar | null = null;
  cobranca: CobrancaAvulsa | null = null;
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  socios: Socio[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService,
    private contasReceberService: ContasReceberService,
    private dadosAuxiliaresService: DadosAuxiliaresService
  ) {}

  ngOnInit(): void {
    this.carregarDadosAuxiliares();
    
    const tipo = this.route.snapshot.data['tipo'];
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (tipo === 'pagar' && id) {
      this.carregarContaPagar(id);
    } else if (tipo === 'receber' && id) {
      this.carregarCobranca(id);
    }
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

    this.dadosAuxiliaresService.getSociosAtivos().subscribe({
      next: (socios: Socio[]) => {
        this.socios = socios;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
      }
    });
  }

  carregarContaPagar(id: number): void {
    this.contasPagarService.obterContaPagarPorId(id).subscribe({
      next: (conta: ContaPagar) => {
        this.contaPagar = conta;
      },
      error: (error) => {
        console.error('Erro ao carregar conta a pagar:', error);
      }
    });
  }

  carregarCobranca(id: number): void {
    this.contasReceberService.obterCobrancaPorId(id).subscribe({
      next: (cobranca: CobrancaAvulsa) => {
        this.cobranca = cobranca;
      },
      error: (error) => {
        console.error('Erro ao carregar cobrança:', error);
      }
    });
  }

  getFornecedorNome(fornecedorId: number | undefined): string {
    if (!fornecedorId) return 'Não informado';
    const fornecedor = this.fornecedores.find(f => f.id === fornecedorId);
    return fornecedor ? fornecedor.nomeFantasia : 'Fornecedor não encontrado';
  }

  getRubricaNome(rubricaId: number | undefined): string {
    if (!rubricaId) return 'Não informado';
    const rubrica = this.rubricas.find(r => r.id === rubricaId);
    return rubrica ? rubrica.nome : 'Rubrica não encontrada';
  }

  getSocioNome(socioId: number | undefined): string {
    if (!socioId) return 'Não informado';
    const socio = this.socios.find(s => s.id === socioId);
    return socio ? socio.nomeSocio : 'Sócio não encontrado';
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

  voltar(): void {
    this.router.navigate(['/pages/financeiro']);
  }

  editar(): void {
    if (this.contaPagar && this.contaPagar.id) {
      this.router.navigate(['/pages/financeiro/contas-pagar/editar', this.contaPagar.id]);
    } else if (this.cobranca && this.cobranca.id) {
      this.router.navigate(['/pages/financeiro/contas-receber/editar', this.cobranca.id]);
    }
  }
}