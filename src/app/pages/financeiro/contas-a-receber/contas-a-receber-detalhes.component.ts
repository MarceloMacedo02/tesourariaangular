import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContasPagarService, ContaPagar } from '../contas-a-pagar/contas-a-pagar.service';

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
                      <div class="form-control" [ngClass]="'status-' + (conta?.status || '').toLowerCase()" readonly>
                        {{ conta?.status | titlecase }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Cliente</label>
                      <div class="form-control" readonly>{{ conta?.fornecedorNome || '-' }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Rubrica</label>
                      <div class="form-control" readonly>{{ conta?.rubricaNome || '-' }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-12">
                    <div class="mb-3">
                      <label class="form-label">Descrição</label>
                      <div class="form-control" readonly>{{ conta?.descricao || '-' }}</div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Valor</label>
                      <div class="form-control" readonly>{{ conta?.valor | currency:'BRL':'symbol':'1.2-2' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Data de Vencimento</label>
                      <div class="form-control" readonly>{{ conta?.dataVencimento | date:'dd/MM/yyyy' }}</div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="mb-3">
                      <label class="form-label">Data de Pagamento</label>
                      <div class="form-control" readonly>
                        {{ conta?.dataPagamento ? (conta.dataPagamento | date:'dd/MM/yyyy') : '-' }}
                      </div>
                    </div>
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
export class ContasAReceberDetalhesComponent implements OnInit {
  conta: ContaPagar | null = null;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService // Usando o mesmo serviço já que a estrutura é semelhante
  ) {}

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

  voltar(): void {
    this.router.navigate(['/pages/financeiro/contas-a-receber']);
  }
}