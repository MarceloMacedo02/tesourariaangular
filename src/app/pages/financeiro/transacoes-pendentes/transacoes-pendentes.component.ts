import { Component, OnInit } from '@angular/core';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoPendente } from '../../../models/transacao-ofx.model';

@Component({
  selector: 'app-transacoes-pendentes',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Transações Pendentes</h4>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let transacao of transacoesPendentes; trackBy: trackByFn">
                        <td>{{ transacao.data | date:'dd/MM/yyyy' }}</td>
                        <td>{{ transacao.descricao }}</td>
                        <td>{{ transacao.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>
                          <span class="badge" [ngClass]="transacao.tipo === 'CREDITO' ? 'bg-success' : 'bg-danger'">
                            {{ transacao.tipo === 'CREDITO' ? 'Crédito' : 'Débito' }}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-warning">Pendente</span>
                        </td>
                        <td>
                          <div class="hstack gap-2">
                            <button 
                              class="btn btn-soft-info btn-sm"
                              (click)="associarTransacao(transacao)">
                              <i class="ri-link align-bottom"></i> Associar
                            </button>
                            <button 
                              class="btn btn-soft-secondary btn-sm"
                              (click)="ignorarTransacao(transacao)">
                              <i class="ri-close-line align-bottom"></i> Ignorar
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div *ngIf="transacoesPendentes.length === 0 && !carregando" class="text-center py-4">
                  <i class="ri-bank-card-2-line display-4 text-muted"></i>
                  <h5 class="mt-3">Nenhuma transação pendente</h5>
                  <p class="text-muted">Não há transações pendentes para processar.</p>
                </div>
                
                <div *ngIf="carregando" class="text-center py-4">
                  <div class="spinner-border text-primary" role="status">
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
  styles: []
})
export class TransacoesPendentesComponent implements OnInit {
  transacoesPendentes: TransacaoPendente[] = [];
  carregando = false;

  constructor(private transacoesOfxService: TransacoesOfxService) {}

  ngOnInit(): void {
    this.carregarTransacoesPendentes();
  }

  carregarTransacoesPendentes(): void {
    this.carregando = true;
    this.transacoesOfxService.getTransacoesPendentes().subscribe({
      next: (data) => {
        this.transacoesPendentes = data;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao carregar transações pendentes:', error);
        this.carregando = false;
      }
    });
  }

  trackByFn(index: number, item: TransacaoPendente): number {
    return item.id;
  }

  associarTransacao(transacao: TransacaoPendente): void {
    // Navegar para a página de associação de sócio com o ID da transação
    console.log('Associar transação:', transacao);
  }

  ignorarTransacao(transacao: TransacaoPendente): void {
    // Ignorar transação
    console.log('Ignorar transação:', transacao);
  }
}