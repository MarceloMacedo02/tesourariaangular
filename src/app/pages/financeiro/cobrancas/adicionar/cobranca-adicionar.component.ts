import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CobrancaDTO } from '../../../../models/cobranca-dto.model';
import { CobrancasService } from '../../../../services/cobrancas.service';

@Component({
  selector: 'app-cobranca-adicionar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Adicionar Cobrança</h4>
                <div class="flex-shrink-0">
                  <button class="btn btn-light" (click)="voltar()">
                    <i class="ri-arrow-left-line align-bottom me-1"></i> Voltar
                  </button>
                </div>
              </div>
              <div class="card-body">
                <form #cobrancaForm="ngForm" (ngSubmit)="salvarCobranca()">
                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="tipoCobranca" class="form-label">Tipo de Cobrança</label>
                        <select 
                          class="form-select" 
                          id="tipoCobranca" 
                          name="tipoCobranca"
                          [(ngModel)]="cobrancaFormModel.tipoCobranca"
                          required
                        >
                          <option value="OUTRAS_RUBRICAS">Outras Rubricas</option>
                          <option value="AVULSA">Contas a Receber</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="socioId" class="form-label">Sócio</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          id="socioId" 
                          name="socioId"
                          [(ngModel)]="cobrancaFormModel.socioId"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="rubricaNome" class="form-label">Rubrica</label>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="rubricaNome" 
                          name="rubricaNome"
                          [(ngModel)]="cobrancaFormModel.rubricaNome"
                          required
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="valor" class="form-label">Valor</label>
                        <input 
                          type="number" 
                          class="form-control" 
                          id="valor" 
                          name="valor"
                          [(ngModel)]="cobrancaFormModel.valor"
                          step="0.01"
                          required
                        >
                      </div>
                    </div>
                  </div>

                  <div class="row mb-4">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="dataVencimento" class="form-label">Data de Vencimento</label>
                        <input 
                          type="date" 
                          class="form-control" 
                          id="dataVencimento" 
                          name="dataVencimento"
                          [(ngModel)]="cobrancaFormModel.dataVencimento"
                        >
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select 
                          class="form-select" 
                          id="status" 
                          name="status"
                          [(ngModel)]="cobrancaFormModel.status"
                        >
                          <option value="PENDENTE">Pendente</option>
                          <option value="PAGO">Pago</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label for="descricao" class="form-label">Descrição</label>
                    <textarea 
                      class="form-control" 
                      id="descricao" 
                      name="descricao"
                      [(ngModel)]="cobrancaFormModel.descricao"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" [disabled]="cobrancaForm.invalid">
                      Salvar Cobrança
                    </button>
                    <button type="button" class="btn btn-secondary" (click)="voltar()">
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
export class CobrancaAdicionarComponent {
  cobrancaFormModel: CobrancaDTO = {
    id: null,
    socioId: null,
    socioNome: '',
    rubricaId: null,
    rubricaNome: '',
    fornecedorId: null,
    fornecedorNome: '',
    grupoMensalidadeId: null,
    grupoMensalidadeNome: '',
    tipoCobranca: 'OUTRAS_RUBRICAS',
    valorOriginal: 0,
    valorPago: 0,
    dataVencimento: null,
    dataPagamento: null,
    status: 'PENDENTE',
    descricao: '',
    dataRegistro: null,
    valor: 0,
    sociosIds: [],
    pagador: '',
    nomeSocio: '',
    inicio: null,
    fim: null,
    dataPagamentoInicio: null,
    dataPagamentoFim: null,
    transacaoId: null
  };

  constructor(
    private cobrancasService: CobrancasService,
    private router: Router
  ) {}

  salvarCobranca(): void {
    this.cobrancasService.criarCobranca(this.cobrancaFormModel).subscribe({
      next: (response) => {
        console.log('Cobrança criada com sucesso:', response);
        this.router.navigate(['/financeiro/cobrancas/listar']); // Redirecionar após salvar
      },
      error: (error) => {
        console.error('Erro ao criar cobrança:', error);
        alert('Erro ao criar cobrança: ' + (error.error?.message || 'Erro desconhecido'));
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/financeiro/cobrancas/listar']);
  }
}