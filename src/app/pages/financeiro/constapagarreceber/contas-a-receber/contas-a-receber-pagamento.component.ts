import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contas-a-receber-pagamento',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Registrar Recebimento</h4>
              </div>
              <div class="card-body">
                <!-- Informações da conta -->
                <div class="row mb-4">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <p class="form-control-plaintext">{{ conta?.descricao || 'Descrição da conta' }}</p>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Valor Original</label>
                      <p class="form-control-plaintext">
                        {{ conta?.valor | currency:'BRL':'symbol':'1.2-2' || 'R$ 0,00' }}
                      </p>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento</label>
                      <p class="form-control-plaintext">
                        {{ conta?.dataVencimento | date:'dd/MM/yyyy' || '01/01/2024' }}
                      </p>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <p class="form-control-plaintext">
                        <span 
                          class="badge" 
                          [ngClass]="getStatusClass(conta?.status || 'PENDENTE')"
                        >
                          {{ getStatusText(conta?.status || 'PENDENTE') }}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <!-- Formulário de pagamento -->
                <form [formGroup]="formPagamento" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="dataPagamento" class="form-label">Data do Pagamento</label>
                        <input
                          type="date"
                          class="form-control"
                          id="dataPagamento"
                          formControlName="dataPagamento"
                        />
                        <div
                          *ngIf="formPagamento.get('dataPagamento')?.invalid && formPagamento.get('dataPagamento')?.touched"
                          class="text-danger"
                        >
                          Data do pagamento é obrigatória
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="valorRecebido" class="form-label">Valor Recebido</label>
                        <input
                          type="text"
                          class="form-control"
                          id="valorRecebido"
                          formControlName="valorRecebido"
                          placeholder="0,00"
                        />
                        <div
                          *ngIf="formPagamento.get('valorRecebido')?.invalid && formPagamento.get('valorRecebido')?.touched"
                          class="text-danger"
                        >
                          Valor recebido é obrigatório
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="formaPagamento" class="form-label">Forma de Pagamento</label>
                        <select class="form-select" id="formaPagamento" formControlName="formaPagamento">
                          <option value="">Selecione</option>
                          <option value="DINHEIRO">Dinheiro</option>
                          <option value="PIX">PIX</option>
                          <option value="BOLETO">Boleto</option>
                          <option value="CARTAO">Cartão</option>
                          <option value="TRANSFERENCIA">Transferência</option>
                        </select>
                        <div
                          *ngIf="formPagamento.get('formaPagamento')?.invalid && formPagamento.get('formaPagamento')?.touched"
                          class="text-danger"
                        >
                          Forma de pagamento é obrigatória
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="contaDestino" class="form-label">Conta de Destino</label>
                        <select class="form-select" id="contaDestino" formControlName="contaDestino">
                          <option value="">Selecione</option>
                          <option value="1">Caixa Principal</option>
                          <option value="2">Conta Corrente Banco X</option>
                          <option value="3">Conta Poupança Banco Y</option>
                        </select>
                        <div
                          *ngIf="formPagamento.get('contaDestino')?.invalid && formPagamento.get('contaDestino')?.touched"
                          class="text-danger"
                        >
                          Conta de destino é obrigatória
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="mb-3">
                    <label for="observacoes" class="form-label">Observações</label>
                    <textarea
                      class="form-control"
                      id="observacoes"
                      formControlName="observacoes"
                      rows="3"
                      placeholder="Observações adicionais"
                    ></textarea>
                  </div>
                  
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" [disabled]="formPagamento.invalid">
                      <i class="ri-check-line align-bottom me-1"></i> Confirmar Recebimento
                    </button>
                    <button type="button" class="btn btn-secondary" (click)="onCancel()">
                      <i class="ri-arrow-left-line align-bottom me-1"></i> Cancelar
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
  conta: any = null; // This would be replaced with the actual ContaAReceber model
  formPagamento: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.formPagamento = this.formBuilder.group({
      dataPagamento: [new Date().toISOString().split('T')[0], Validators.required],
      valorRecebido: ['', Validators.required],
      formaPagamento: ['', Validators.required],
      contaDestino: ['', Validators.required],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    // Load account data based on route parameter
    // This would be implemented based on actual routing
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'bg-success';
      case 'CANCELADO':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'PAGO':
        return 'Pago';
      case 'CANCELADO':
        return 'Cancelado';
      default:
        return 'Pendente';
    }
  }

  onSubmit(): void {
    if (this.formPagamento.valid) {
      console.log('Pagamento registrado:', this.formPagamento.value);
      // Implement the actual payment registration logic here
    }
  }

  onCancel(): void {
    console.log('Cancelado');
    // Navigate back
  }
}