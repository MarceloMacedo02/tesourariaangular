import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CobrancasAvulsasService, Cobranca } from './cobrancas-avulsas.service';

@Component({
  selector: 'app-cobrancas-avulsas-pagamento',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">Registrar Pagamento</h4>
              </div>
              <div class="card-body" *ngIf="cobranca">
                <div class="row mb-4">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <div class="form-control" readonly>{{ cobranca.descricao }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Cliente</label>
                      <div class="form-control" readonly>
                        {{ cobranca.socioNome || cobranca.fornecedorNome || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Valor Original</label>
                      <div class="form-control" readonly>{{ cobranca.valorOriginal | currency:'BRL':'symbol':'1.2-2' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento</label>
                      <div class="form-control" readonly>{{ cobranca.dataVencimento | date:'dd/MM/yyyy' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <div class="form-control" [ngClass]="'status-' + cobranca.status.toLowerCase()" readonly>
                        {{ cobranca.status | titlecase }}
                      </div>
                    </div>
                  </div>
                </div>

                <form [formGroup]="formPagamento" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="contaFinanceiraId" class="form-label">Conta Financeira *</label>
                        <select 
                          class="form-control" 
                          id="contaFinanceiraId" 
                          formControlName="contaFinanceiraId">
                          <option value="">Selecione uma conta financeira</option>
                          <!-- Em implementação real, esta lista seria populada dinamicamente -->
                          <option value="1">Caixa Principal</option>
                          <option value="2">Conta Corrente Banco X</option>
                          <option value="3">Conta Poupança</option>
                        </select>
                        <div 
                          *ngIf="formPagamento.get('contaFinanceiraId')?.invalid && formPagamento.get('contaFinanceiraId')?.touched" 
                          class="text-danger">
                          Conta financeira é obrigatória
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="dataPagamento" class="form-label">Data de Pagamento *</label>
                        <input 
                          type="date" 
                          class="form-control" 
                          id="dataPagamento" 
                          formControlName="dataPagamento">
                        <div 
                          *ngIf="formPagamento.get('dataPagamento')?.invalid && formPagamento.get('dataPagamento')?.touched" 
                          class="text-danger">
                          Data de pagamento é obrigatória
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-between">
                    <button 
                      type="button" 
                      class="btn btn-secondary"
                      (click)="cancelar()">
                      Cancelar
                    </button>
                    <button 
                      type="submit" 
                      class="btn btn-success"
                      [disabled]="formPagamento.invalid || cobranca.status !== 'ABERTA'">
                      Confirmar Pagamento
                    </button>
                  </div>
                </form>
              </div>
              <div class="card-body" *ngIf="!cobranca && !carregando">
                <div class="alert alert-info" role="alert">
                  Cobrança não encontrada ou já está paga/cancelada.
                </div>
              </div>
              <div class="card-body" *ngIf="carregando">
                <div class="d-flex justify-content-center">
                  <div class="spinner-border" role="status">
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
  styles: [`
    .status-aberta {
      background-color: #fff3cd;
      color: #856404;
    }
    .status-paga {
      background-color: #d4edda;
      color: #155724;
    }
    .status-cancelada {
      background-color: #f8d7da;
      color: #721c24;
    }
  `]
})
export class CobrancasAvulsasPagamentoComponent implements OnInit {

  formPagamento: FormGroup;
  cobranca: Cobranca | null = null;
  carregando = true;
  cobrancaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private cobrancasAvulsasService: CobrancasAvulsasService
  ) {
    this.formPagamento = this.fb.group({
      contaFinanceiraId: ['', Validators.required],
      dataPagamento: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.cobrancaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.cobrancaId) {
      this.loadCobranca();
    } else {
      this.carregando = false;
    }
  }

  loadCobranca(): void {
    this.cobrancasAvulsasService.getById(this.cobrancaId!).subscribe({
      next: (data) => {
        this.cobranca = data;
        this.carregando = false;
        
        // Se a cobrança já estiver paga ou cancelada, desabilitar o formulário
        if (data.status !== 'ABERTA') {
          this.formPagamento.disable();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar cobrança:', error);
        this.carregando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.formPagamento.invalid || !this.cobrancaId) {
      return;
    }

    const formData = this.formPagamento.value;
    
    // Chamada para registrar pagamento
    this.cobrancasAvulsasService.registrarPagamento(this.cobrancaId, formData.contaFinanceiraId).subscribe({
      next: (cobrancaAtualizada) => {
        console.log('Pagamento registrado com sucesso:', cobrancaAtualizada);
        // Navegar de volta para a lista ou detalhes
        this.router.navigate(['/pages/financeiro/cobrancas-avulsas/detalhes', this.cobrancaId]);
      },
      error: (error) => {
        console.error('Erro ao registrar pagamento:', error);
        alert('Erro ao registrar pagamento: ' + (error.error?.message || 'Erro desconhecido'));
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/cobrancas-avulsas/detalhes', this.cobrancaId]);
  }
}