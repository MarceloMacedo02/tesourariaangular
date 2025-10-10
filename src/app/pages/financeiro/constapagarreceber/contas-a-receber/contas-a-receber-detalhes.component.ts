import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contas-a-receber-detalhes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Detalhes da Conta a Receber</h4>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <p class="form-control-plaintext">{{ conta?.descricao || 'Descrição da conta' }}</p>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Valor</label>
                      <p class="form-control-plaintext">
                        {{ conta?.valor | currency:'BRL':'symbol':'1.2-2' || 'R$ 0,00' }}
                      </p>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento</label>
                      <p class="form-control-plaintext">
                        {{ conta?.dataVencimento | date:'dd/MM/yyyy' || '01/01/2024' }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
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
                    
                    <div class="mb-3">
                      <label class="form-label">Categoria</label>
                      <p class="form-control-plaintext">{{ conta?.categoria || 'Não informado' }}</p>
                    </div>
                    
                    <div class="mb-3">
                      <label class="form-label">Forma de Pagamento</label>
                      <p class="form-control-plaintext">{{ conta?.formaPagamento || 'Não informado' }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="row">
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">Observações</label>
                      <p class="form-control-plaintext">
                        {{ conta?.observacoes || 'Nenhuma observação registrada' }}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="d-flex gap-2">
                  <button class="btn btn-primary" (click)="onEditar()">
                    <i class="ri-pencil-line align-bottom me-1"></i> Editar
                  </button>
                  <button class="btn btn-success" (click)="onReceber()">
                    <i class="ri-bank-line align-bottom me-1"></i> Registrar Recebimento
                  </button>
                  <button class="btn btn-secondary" (click)="onVoltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
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
export class ContasAReceberDetalhesComponent implements OnInit {
  conta: any = null; // This would be replaced with the actual ContaAReceber model

  constructor() { }

  ngOnInit(): void {
    // Load data based on route parameter
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

  onEditar(): void {
    console.log('Editar conta');
    // Navigate to edit form
  }

  onReceber(): void {
    console.log('Registrar recebimento');
    // Navigate to payment form or open modal
  }

  onVoltar(): void {
    console.log('Voltar');
    // Navigate back to list
  }
}