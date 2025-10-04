import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContasPagarService } from '../financeiro.service';

@Component({
  selector: 'app-importar-contas-pagar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Importar Contas a Pagar via CSV</h4>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label for="csvFile" class="form-label">Selecionar Arquivo CSV</label>
                      <input 
                        type="file" 
                        class="form-control" 
                        id="csvFile"
                        accept=".csv"
                        (change)="onFileSelected($event)"
                        [disabled]="loading">
                      <div class="form-text">Formato aceito: CSV. Apenas arquivos CSV são permitidos.</div>
                    </div>
                    
                    <div class="d-flex gap-2">
                      <button 
                        type="button" 
                        class="btn btn-primary" 
                        (click)="uploadCSV()"
                        [disabled]="!selectedFile || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        {{ loading ? 'Processando...' : 'Importar CSV' }}
                      </button>
                      
                      <button 
                        type="button" 
                        class="btn btn-success" 
                        (click)="exportTemplate()"
                        [disabled]="loading">
                        Baixar Modelo CSV
                      </button>
                    </div>
                  </div>
                  
                  <div class="col-lg-6">
                    <div class="alert alert-info">
                      <h5 class="alert-heading">Instruções:</h5>
                      <ul class="mb-0">
                        <li>O arquivo deve estar no formato CSV</li>
                        <li>As colunas devem estar na ordem correta</li>
                        <li>As colunas obrigatórias são: fornecedorId, rubricaId, descricao, valor, dataVencimento</li>
                        <li>O sistema validará os dados antes de importar</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <!-- Indicador de carregamento -->
                <div *ngIf="loading" class="mt-4">
                  <div class="d-flex align-items-center">
                    <div class="spinner-border text-primary me-2" role="status">
                      <span class="visually-hidden">Carregando...</span>
                    </div>
                    <span>Processando o arquivo CSV, por favor aguarde...</span>
                  </div>
                </div>
                
                <!-- Mensagens de erro -->
                <div *ngIf="error" class="alert alert-danger mt-3">
                  {{ error }}
                </div>
                
                <!-- Resultados do processamento -->
                <div *ngIf="results" class="mt-4">
                  <h5>Resultados do Processamento</h5>
                  <div class="row mb-3">
                    <div class="col-md-4">
                      <div class="card text-center">
                        <div class="card-body">
                          <h5 class="card-title">{{ results.linhasProcessadas || 0 }}</h5>
                          <p class="card-text">Linhas Processadas</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card text-center">
                        <div class="card-body">
                          <h5 class="card-title">{{ getContasNovasCount() || 0 }}</h5>
                          <p class="card-text">Contas Novas</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="card text-center">
                        <div class="card-body">
                          <h5 class="card-title">{{ getContasAtualizadasCount() || 0 }}</h5>
                          <p class="card-text">Contas Atualizadas</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Lista de contas processadas -->
                  <div class="table-responsive">
                    <table class="table table-striped table-nowrap align-middle mb-0">
                      <thead class="table-light">
                        <tr>
                          <th>Fornecedor</th>
                          <th>Rubrica</th>
                          <th>Descrição</th>
                          <th>Valor</th>
                          <th>Vencimento</th>
                          <th>Status</th>
                          <th>Mensagem</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let conta of results.contasProcessadas">
                          <td>{{ conta.fornecedorNome }}</td>
                          <td>{{ conta.rubricaNome }}</td>
                          <td>{{ conta.descricao }}</td>
                          <td>{{ conta.valor | currency:'BRL':'symbol':'1.2-2' }}</td>
                          <td>{{ conta.dataVencimento | date:'shortDate' }}</td>
                          <td>
                            <span class="badge" [ngClass]="getStatusBadgeClass(conta.status)">
                              {{ conta.status }}
                            </span>
                          </td>
                          <td>{{ conta.mensagem }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ImportarContasPagarComponent {
  selectedFile: File | null = null;
  loading = false;
  error: string | null = null;
  results: any = null;

  constructor(
    private fb: FormBuilder,
    private contasPagarService: ContasPagarService
  ) { }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        this.error = 'Apenas arquivos CSV são permitidos.';
        this.selectedFile = null;
        return;
      }
      this.selectedFile = file;
      this.error = null;
    }
  }

  uploadCSV(): void {
    if (!this.selectedFile) {
      this.error = 'Por favor, selecione um arquivo CSV.';
      return;
    }

    this.loading = true;
    this.error = null;

    // Simulação de upload - na prática, você faria uma chamada HTTP
    setTimeout(() => {
      this.loading = false;
      this.results = {
        linhasProcessadas: 10,
        contasProcessadas: [
          {
            fornecedorNome: 'Fornecedor A',
            rubricaNome: 'Aluguel',
            descricao: 'Aluguel de escritório',
            valor: 5000.00,
            dataVencimento: '2023-10-01',
            status: 'SUCESSO',
            mensagem: 'Conta importada com sucesso'
          },
          {
            fornecedorNome: 'Fornecedor B',
            rubricaNome: 'Água',
            descricao: 'Conta de água',
            valor: 250.00,
            dataVencimento: '2023-10-15',
            status: 'ERRO',
            mensagem: 'Fornecedor não encontrado'
          }
        ]
      };
    }, 2000);
  }

  exportTemplate(): void {
    // Criação e download do modelo CSV
    const csvContent = 'fornecedorId,rubricaId,descricao,valor,dataVencimento\n1,1,"Aluguel de escritório",5000.00,2023-10-01\n2,2,"Conta de água",250.00,2023-10-15';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'modelo_contas_pagar.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'SUCESSO': return 'bg-success';
      case 'ERRO': return 'bg-danger';
      case 'ATUALIZADO': return 'bg-info';
      default: return 'bg-secondary';
    }
  }

  getContasNovasCount(): number {
    if (!this.results || !this.results.contasProcessadas) return 0;
    return this.results.contasProcessadas.filter((c: any) => c.status === 'SUCESSO').length;
  }

  getContasAtualizadasCount(): number {
    if (!this.results || !this.results.contasProcessadas) return 0;
    return this.results.contasProcessadas.filter((c: any) => c.status === 'ATUALIZADO').length;
  }
}