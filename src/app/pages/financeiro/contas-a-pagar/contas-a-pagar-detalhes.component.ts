import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContasPagarService, ContaPagar } from './contas-a-pagar.service';

@Component({
  selector: 'app-contas-a-pagar-detalhes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Detalhes da Conta a Pagar</h4>
                <div class="flex-shrink-0">
                  <button 
                    class="btn btn-light"
                    (click)="voltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
                </div>
              </div>
              <div class="card-body" *ngIf="conta">
          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">ID</label>
                <div class="form-control" readonly>{{ conta.id }}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Status</label>
                <div class="form-control" [ngClass]="'status-' + conta.status.toLowerCase()" readonly>
                  {{ conta.status | titlecase }}
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Fornecedor</label>
                <div class="form-control" readonly>{{ conta.fornecedorNome }}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="mb-3">
                <label class="form-label">Rubrica</label>
                <div class="form-control" readonly>{{ conta.rubricaNome }}</div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <div class="mb-3">
                <label class="form-label">Descrição</label>
                <div class="form-control" readonly>{{ conta.descricao }}</div>
              </div>
            </div>
          </div>

          <div class="row">
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
                <label class="form-label">Data de Pagamento</label>
                <div class="form-control" readonly>
                  {{ conta.dataPagamento ? (conta.dataPagamento | date:'dd/MM/yyyy') : 'Não pago' }}
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-end" *ngIf="conta.status === 'ABERTA'">
            <button 
              class="btn btn-success me-2"
              (click)="registrarPagamento()">
              Registrar Pagamento
            </button>
            <button 
              class="btn btn-primary"
              [routerLink]="['/pages/contas-a-pagar/editar', conta.id]">
              Editar
            </button>
          </div>
              </div>
              <div class="card-body" *ngIf="!conta && !carregando">
                <div class="alert alert-info" role="alert">
                  Conta a pagar não encontrada.
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
export class ContasPagarDetalhesComponent implements OnInit {

  conta: ContaPagar | null = null;
  carregando = true;
  contaId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService
  ) { }

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
      },
      error: (error) => {
        console.error('Erro ao carregar conta a pagar:', error);
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/pages/financeiro/contas-a-pagar/lista']);
  }

  registrarPagamento(): void {
    // Em implementação real, isso abriria um modal para selecionar conta financeira
    console.log('Registrar pagamento para conta:', this.contaId);
    // Exemplo de chamada para registrar pagamento:
    // this.contasPagarService.registrarPagamento(this.contaId!, contaFinanceiraId).subscribe(...)
  }
}