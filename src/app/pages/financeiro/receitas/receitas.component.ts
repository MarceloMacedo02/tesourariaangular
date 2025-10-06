import { Component, OnInit } from '@angular/core';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoDto } from '../../../models/transacao-ofx.model';

@Component({
  selector: 'app-receitas',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Receitas</h4>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-striped table-nowrap">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Origem</th>
                        <th>Status</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let receita of receitas; trackBy: trackByFn">
                        <td>{{ receita.data | date:'dd/MM/yyyy' }}</td>
                        <td>{{ receita.descricao }}</td>
                        <td>{{ receita.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                        <td>
                          <span *ngIf="receita.fornecedorOuSocio; else semOrigem">
                            {{ receita.fornecedorOuSocio }}
                          </span>
                          <ng-template #semOrigem>
                            <span class="text-muted">Não identificado</span>
                          </ng-template>
                        </td>
                        <td>
                          <span class="badge bg-success">Lançado</span>
                        </td>
                        <td>
                          <div class="hstack gap-2">
                            <button 
                              class="btn btn-soft-info btn-sm"
                              (click)="detalhesReceita(receita)">
                              <i class="ri-eye-fill align-bottom"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div *ngIf="receitas.length === 0 && !carregando" class="text-center py-4">
                  <i class="ri-bank-card-2-line display-4 text-muted"></i>
                  <h5 class="mt-3">Nenhuma receita</h5>
                  <p class="text-muted">Não há receitas registradas.</p>
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
export class ReceitasComponent implements OnInit {
  receitas: TransacaoDto[] = [];
  carregando = false;

  constructor(private transacoesOfxService: TransacoesOfxService) {}

  ngOnInit(): void {
    this.carregarReceitas();
  }

  carregarReceitas(): void {
    this.carregando = true;
    this.transacoesOfxService.getTransacoesCredito().subscribe({
      next: (data: any[]) => {
        this.receitas = data;
        this.carregando = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar receitas:', error);
        this.carregando = false;
      }
    });
  }

  trackByFn(index: number, item: TransacaoDto): number {
    return item.id;
  }

  detalhesReceita(receita: TransacaoDto): void {
    // Implementar navegação para detalhes da receita
    console.log('Detalhes da receita:', receita);
  }
}