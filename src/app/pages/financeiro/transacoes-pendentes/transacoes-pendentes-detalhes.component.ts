import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoPendente } from '../../../models/transacao-ofx.model';
import { Fornecedor, ReferenciasFinanceirasService, Rubrica, Socio } from '../../../services/referencias-financeiras.service';

@Component({
  selector: 'app-transacoes-pendentes-detalhes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Detalhes da Transação Pendente</h4>
                <div class="flex-shrink-0">
                  <button 
                    class="btn btn-light"
                    (click)="voltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
                </div>
              </div>
              <div class="card-body" *ngIf="transacao">
                <div class="row mb-4">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Data</label>
                      <div class="form-control" readonly>{{ transacao.data | date:'dd/MM/yyyy' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Tipo</label>
                      <div class="form-control" readonly>
                        <span class="badge" [ngClass]="transacao.tipo === 'CREDITO' ? 'bg-success' : 'bg-danger'">
                          {{ transacao.tipo === 'CREDITO' ? 'Crédito' : 'Débito' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <div class="form-control" readonly>{{ transacao.descricao }}</div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Valor</label>
                      <div class="form-control" readonly>{{ transacao.valor | currency:'BRL':'symbol':'1.2-2' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Documento</label>
                      <div class="form-control" readonly>{{ transacao.documento }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <div class="form-control" readonly>
                        <span class="badge bg-warning">Pendente</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Formulário para associação -->
                <div class="row mt-5">
                  <div class="col-md-12">
                    <h5>Associar a Sócio ou Fornecedor</h5>
                    <form #associacaoForm="ngForm" (ngSubmit)="associarTransacao()">
                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="tipoRelacionamento" class="form-label">Tipo de Relacionamento</label>
                            <select 
                              class="form-control" 
                              id="tipoRelacionamento"
                              [(ngModel)]="tipoRelacionamento"
                              name="tipoRelacionamento"
                              required>
                              <option value="">Selecione...</option>
                              <option value="SOCIO">Sócio</option>
                              <option value="FORNECEDOR">Fornecedor</option>
                            </select>
                          </div>
                        </div>
                        
                        <div class="col-md-6" *ngIf="tipoRelacionamento">
                          <div class="mb-3">
                            <label for="relacionadoId" class="form-label">
                              {{ tipoRelacionamento === 'SOCIO' ? 'Sócio' : 'Fornecedor' }}
                            </label>
                            <select 
                              class="form-control" 
                              id="relacionadoId"
                              [(ngModel)]="relacionadoId"
                              name="relacionadoId"
                              required>
                              <option value="">Selecione...</option>
                              <option 
                                *ngFor="let item of (tipoRelacionamento === 'SOCIO' ? socios : fornecedores)" 
                                [value]="item.id">
                                {{ item.nome }}
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div class="row" *ngIf="tipoRelacionamento && relacionadoId">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="rubricaId" class="form-label">Rubrica</label>
                            <select 
                              class="form-control" 
                              id="rubricaId"
                              [(ngModel)]="rubricaId"
                              name="rubricaId"
                              required>
                              <option value="">Selecione uma rubrica</option>
                              <option 
                                *ngFor="let rubrica of rubricas" 
                                [value]="rubrica.id">
                                {{ rubrica.nome }} ({{ rubrica.tipo }})
                              </option>
                            </select>
                          </div>
                        </div>
                        
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="tipoLancamento" class="form-label">Tipo de Lançamento</label>
                            <select 
                              class="form-control" 
                              id="tipoLancamento"
                              [(ngModel)]="tipoLancamento"
                              name="tipoLancamento"
                              required>
                              <option value="">Selecione...</option>
                              <option value="RECEITA">Receita</option>
                              <option value="DESPESA">Despesa</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="mt-4">
                        <button 
                          type="submit" 
                          class="btn btn-success"
                          [disabled]="associacaoForm.invalid">
                          <i class="ri-check-line align-bottom me-1"></i> Associar Transação
                        </button>
                      </div>
                    </form>
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
export class TransacoesPendentesDetalhesComponent implements OnInit {
  transacao: TransacaoPendente | null = null;
  idTransacao: number | null = null;
  
  // Dados para associação
  tipoRelacionamento: 'SOCIO' | 'FORNECEDOR' | '' = '';
  relacionadoId: number | null = null;
  rubricaId: number | null = null;
  tipoLancamento: 'RECEITA' | 'DESPESA' | '' = '';
  
  socios: Socio[] = [];
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transacoesOfxService: TransacoesOfxService,
    private referenciasService: ReferenciasFinanceirasService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idTransacao = +params['id'];
      if (this.idTransacao) {
        this.carregarTransacao();
      }
    });
    
    this.carregarReferencias();
  }

  carregarTransacao(): void {
    this.transacoesOfxService.getTransacaoPendenteById(this.idTransacao!).subscribe({
      next: (data) => {
        this.transacao = data;
      },
      error: (error) => {
        console.error('Erro ao carregar transação:', error);
      }
    });
  }

  carregarReferencias(): void {
    this.referenciasService.getAllSocios().subscribe({
      next: (data: any[]) => {
        this.socios = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar sócios:', error);
      }
    });
    
    this.referenciasService.getAllFornecedores().subscribe({
      next: (data: any[]) => {
        this.fornecedores = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar fornecedores:', error);
      }
    });
    
    this.referenciasService.getAllRubricas().subscribe({
      next: (data: any[]) => {
        this.rubricas = data;
      },
      error: (error: any) => {
        console.error('Erro ao carregar rubricas:', error);
      }
    });
  }

  associarTransacao(): void {
    if (!this.transacao || !this.idTransacao) {
      return;
    }
    
    const dadosAssociacao = {
      tipoRelacionamento: this.tipoRelacionamento,
      relacionadoId: this.relacionadoId,
      rubricaId: this.rubricaId,
      tipoLancamento: this.tipoLancamento
    };
    
    this.transacoesOfxService.associarTransacao(this.idTransacao, dadosAssociacao).subscribe({
      next: () => {
        alert('Transação associada com sucesso!');
        this.voltar();
      },
      error: (error) => {
        console.error('Erro ao associar transação:', error);
        alert('Erro ao associar transação: ' + error.message);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/pages/financeiro/transacoes-pendentes']);
  }
}