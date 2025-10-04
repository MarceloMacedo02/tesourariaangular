import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContasPagarService, ContaPagar } from './contas-a-pagar.service';

@Component({
  selector: 'app-contas-a-pagar-pagamento',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">Registrar Pagamento</h4>
              </div>
              <div class="card-body" *ngIf="conta">
          <div class="row mb-4">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Descrição</label>
                <div class="form-control" readonly>{{ conta.descricao }}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Fornecedor</label>
                <div class="form-control" readonly>{{ conta.fornecedorNome }}</div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Valor</label>
                <div class="form-control" readonly>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Data de Vencimento</label>
                <div class="form-control" readonly>{{ conta.dataVencimento | date:'dd/MM/yyyy' }}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-3">
                <label class="form-label">Status</label>
                <div class="form-control" [ngClass]="'status-' + conta.status.toLowerCase()" readonly>
                  {{ conta.status | titlecase }}
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
                    class="form-select" 
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
                [disabled]="formPagamento.invalid || conta.status !== 'ABERTA'">
                Confirmar Pagamento
              </button>
            </div>
          </form>
              </div>
              <div class="card-body" *ngIf="!conta && !carregando">
                <div class="alert alert-info" role="alert">
                  Conta a pagar não encontrada ou já está paga/cancelada.
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
export class ContasPagarPagamentoComponent implements OnInit {

  formPagamento: FormGroup;
  conta: ContaPagar | null = null;
  carregando = true;
  contaId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService
  ) {
    this.formPagamento = this.fb.group({
      contaFinanceiraId: ['', Validators.required],
      dataPagamento: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {
    this.contaId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.contaId) {
      this.loadConta();
    } else {
      this.carregando = false;
    }
  }

  loadConta(): void {
    this.contasPagarService.getById(this.contaId!).subscribe({
      next: (data) => {
        this.conta = data;
        this.carregando = false;
        
        // Se a conta já estiver paga ou cancelada, desabilitar o formulário
        if (data.status !== 'ABERTA') {
          this.formPagamento.disable();
        }
      },
      error: (error) => {
        console.error('Erro ao carregar conta a pagar:', error);
        this.carregando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.formPagamento.invalid || !this.contaId) {
      return;
    }

    const formData = this.formPagamento.value;
    
    // Chamada para registrar pagamento
    this.contasPagarService.registrarPagamento(this.contaId, formData.contaFinanceiraId).subscribe({
      next: (contaAtualizada) => {
        console.log('Pagamento registrado com sucesso:', contaAtualizada);
        // Navegar de volta para a lista ou detalhes
        this.router.navigate(['/pages/financeiro/contas-a-pagar/detalhes', this.contaId]);
      },
      error: (error) => {
        console.error('Erro ao registrar pagamento:', error);
        // Tratar erro apropriadamente (ex: mostrar mensagem para o usuário)
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/contas-a-pagar/detalhes', this.contaId]);
  }
}