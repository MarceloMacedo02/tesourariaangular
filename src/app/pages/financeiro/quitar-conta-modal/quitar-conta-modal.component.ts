import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContaFinanceira } from '../financeiro.model';
import { DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-quitar-conta-modal',
  template: `
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Quitar {{ data.tipo === 'pagar' ? 'Conta a Pagar' : 'Cobrança' }}</h5>
        <button type="button" class="btn-close" (click)="fechar()"></button>
      </div>
      <div class="modal-body">
        <form [formGroup]="quitarForm" (ngSubmit)="onSubmit()">
          <div class="mb-3">
            <label for="contaFinanceiraId" class="form-label">Conta Financeira *</label>
            <select class="form-control" id="contaFinanceiraId" formControlName="contaFinanceiraId" required>
              <option value="">Selecione uma conta financeira</option>
              <option *ngFor="let conta of contasFinanceiras" [value]="conta.id">
                {{ conta.nomeConta }}
              </option>
            </select>
          </div>
          
          <div class="mb-3">
            <label for="dataPagamento" class="form-label">Data de Pagamento *</label>
            <input type="date" class="form-control" id="dataPagamento" formControlName="dataPagamento" required>
          </div>
          
          <div class="mb-3" *ngIf="data.valor">
            <label class="form-label">Valor: {{ data.valor | currency:'BRL':'symbol':'1.2-2' }}</label>
          </div>
          
          <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-light" (click)="fechar()">Cancelar</button>
            <button type="submit" class="btn btn-primary" [disabled]="quitarForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ loading ? 'Quitando...' : 'Quitar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class QuitarContaModalComponent {
  quitarForm: FormGroup;
  contasFinanceiras: ContaFinanceira[] = [];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<QuitarContaModalComponent>,
    private dadosAuxiliaresService: DadosAuxiliaresService,
    @Inject(MAT_DIALOG_DATA) public data: { 
      tipo: 'pagar' | 'receber'; 
      id: number; 
      valor?: number 
    }
  ) {
    this.quitarForm = this.fb.group({
      contaFinanceiraId: ['', Validators.required],
      dataPagamento: [new Date().toISOString().split('T')[0], Validators.required]
    });

    this.carregarContasFinanceiras();
  }

  carregarContasFinanceiras(): void {
    this.dadosAuxiliaresService.getContasFinanceiras().subscribe({
      next: (contas: ContaFinanceira[]) => {
        this.contasFinanceiras = contas;
      },
      error: (error) => {
        console.error('Erro ao carregar contas financeiras:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.quitarForm.valid) {
      this.loading = true;
      const formData = this.quitarForm.value;
      
      this.dialogRef.close({
        contaFinanceiraId: formData.contaFinanceiraId,
        dataPagamento: formData.dataPagamento
      });
    }
  }

  fechar(): void {
    this.dialogRef.close();
  }
}