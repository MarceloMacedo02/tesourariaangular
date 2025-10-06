import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContasPagarService, ContaPagar } from '../contas-a-pagar/contas-a-pagar.service';

@Component({
  selector: 'app-contas-a-receber-pagamento',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">Registrar Recebimento</h4>
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
                      <label class="form-label">Cliente</label>
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
                  </div>

                  <div class="mt-4">
                    <button 
                      type="submit" 
                      class="btn btn-success"
                      [disabled]="formPagamento.invalid || carregando">
                      <span *ngIf="carregando" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      {{ carregando ? 'Registrando...' : 'Registrar Recebimento' }}
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-light ms-2"
                      (click)="cancelar()">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ContasAReceberPagamentoComponent implements OnInit {
  conta: ContaPagar | null = null;
  id: number | null = null;
  carregando = false;

  formPagamento: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService, // Usando o mesmo serviço
    private fb: FormBuilder
  ) {
    this.formPagamento = this.fb.group({
      contaFinanceiraId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      if (this.id) {
        this.carregarConta();
      }
    });
  }

  carregarConta(): void {
    this.contasPagarService.getById(this.id!).subscribe({
      next: (data) => {
        this.conta = data;
      },
      error: (error) => {
        console.error('Erro ao carregar conta:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.formPagamento.valid && this.id) {
      const contaFinanceiraId = this.formPagamento.get('contaFinanceiraId')?.value;
      
      this.carregando = true;
      // Usando o mesmo método de pagamento, mas adaptando o nome
      this.contasPagarService.registrarPagamento(this.id, contaFinanceiraId).subscribe({
        next: (data) => {
          alert('Recebimento registrado com sucesso!');
          this.carregando = false;
          this.router.navigate(['/pages/financeiro/contas-a-receber']);
        },
        error: (error) => {
          console.error('Erro ao registrar recebimento:', error);
          this.carregando = false;
          alert('Erro ao registrar recebimento: ' + error.message);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/contas-a-receber']);
  }
}