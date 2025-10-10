import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


export interface Rubrica {
  id: number;
  nome: string;
}

export interface Socio {
  id: number;
  nomeSocio: string;
}

export interface Cobranca {
  id: number;
  descricao: string;
  valor: number;
  rubricaId: number | null;
  socioNome?: string;
  dataVencimento?: string;
  tipoCobranca?: string;
}

@Component({
  selector: 'app-modais-transacoes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  template: `
    <!-- Modal: Associar Sócio à Transação -->
    <div class="modal fade" [class.show]="isAssociarSocioModalOpen()" *ngIf="isAssociarSocioModalOpen()"
        (click)="fecharModalAssociarSocio()" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Associar Sócio à Transação</h5>
                    <button type="button" class="btn-close" (click)="fecharModalAssociarSocio()"></button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onAssociarSocio()">
                        <div class="mb-3">
                            <label for="socioSelect" class="form-label">Selecione o Sócio</label>
                            <select id="socioSelect" [(ngModel)]="modalSocioId" name="modalSocioId" required
                                class="form-control">
                                <option [ngValue]="null">Selecione um sócio</option>
                                <option *ngFor="let socio of socios()" [ngValue]="socio.id">{{ socio.nomeSocio }}</option>
                            </select>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2"
                                (click)="fecharModalAssociarSocio()">Cancelar</button>
                            <button type="submit" [disabled]="!modalSocioId" class="btn btn-primary">
                                Associar Sócio
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Adicionar Nova Conta a Receber -->
    <div class="modal fade" [class.show]="isNovaContaReceberModalOpen()" *ngIf="isNovaContaReceberModalOpen()"
        (click)="fecharModalNovaContaReceber()" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adicionar Nova Conta a Receber</h5>
                    <button type="button" class="btn-close" (click)="fecharModalNovaContaReceber()"></button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSalvarNovaConta()">
                        <div class="mb-3">
                            <label for="modalRubricaSelect" class="form-label">Rubrica</label>
                            <select id="modalRubricaSelect" [(ngModel)]="novaConta.rubricaId" name="rubricaId" required
                                class="form-control">
                                <option value="">Selecione a rubrica</option>
                                <option *ngFor="let rubrica of rubricas()" [value]="rubrica.id">{{ rubrica.nome }}</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="modalDescricaoInput" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="modalDescricaoInput"
                                [(ngModel)]="novaConta.descricao" name="descricao" required>
                        </div>
                        <div class="mb-3">
                            <label for="modalDataVencimentoInput" class="form-label">Data de Vencimento</label>
                            <input type="date" class="form-control" id="modalDataVencimentoInput"
                                [(ngModel)]="novaConta.dataVencimento" name="dataVencimento" required>
                        </div>
                        <div class="mb-3">
                            <label for="modalValorInput" class="form-label">Valor (R$)</label>
                            <input type="number" class="form-control" id="modalValorInput" [(ngModel)]="novaConta.valor"
                                name="valor" required min="0.01" step="0.01">
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2"
                                (click)="fecharModalNovaContaReceber()">Cancelar</button>
                            <button type="submit" class="btn btn-success">Salvar Conta</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Editar Conta a Receber -->
    <div class="modal fade" [class.show]="isEditContaReceberModalOpen()" *ngIf="isEditContaReceberModalOpen()"
        (click)="fecharModalEditContaReceber()" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Conta a Receber</h5>
                    <button type="button" class="btn-close" (click)="fecharModalEditContaReceber()"></button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSalvarEdicaoConta()">
                        <div class="mb-3">
                            <label for="editModalDescricaoInput" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="editModalDescricaoInput"
                                [(ngModel)]="editConta.descricao" name="editDescricao" required>
                        </div>
                        <div class="mb-3">
                            <label for="editModalDataVencimentoInput" class="form-label">Data de Vencimento</label>
                            <input type="date" class="form-control" id="editModalDataVencimentoInput"
                                [(ngModel)]="editConta.dataVencimento" name="editDataVencimento" required>
                        </div>
                        <div class="mb-3">
                            <label for="editModalValorInput" class="form-label">Valor (R$)</label>
                            <input type="number" class="form-control" id="editModalValorInput" [(ngModel)]="editConta.valor"
                                name="editValor" required min="0.01" step="0.01">
                        </div>
                        <div class="mb-3">
                            <label for="editModalRubricaSelect" class="form-label">Rubrica</label>
                            <select id="editModalRubricaSelect" [(ngModel)]="editConta.rubricaId" name="editRubricaId"
                                required class="form-control">
                                <option value="">Selecione a rubrica</option>
                                <option *ngFor="let rubrica of rubricas()" [value]="rubrica.id">{{ rubrica.nome }}</option>
                            </select>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2"
                                (click)="fecharModalEditContaReceber()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Salvar Alterações</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Confirmar Exclusão -->
    <div class="modal fade" [class.show]="isExcluirContaReceberModalOpen()" *ngIf="isExcluirContaReceberModalOpen()"
        (click)="fecharModalExcluirContaReceber()" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title text-danger">Confirmar Exclusão</h5>
                    <button type="button" class="btn-close" (click)="fecharModalExcluirContaReceber()"></button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger">
                        <strong>Atenção!</strong> Esta ação não pode ser desfeita.
                    </div>
                    <p>Você tem certeza que deseja excluir esta conta a receber?</p>
                    <div class="card bg-light mb-3" *ngIf="contaParaExcluir()">
                        <div class="card-body">
                            <dl class="row mb-0">
                                <dt class="col-sm-4">Descrição:</dt>
                                <dd class="col-sm-8">{{ contaParaExcluir().descricao }}</dd>
                                <dt class="col-sm-4">Valor:</dt>
                                <dd class="col-sm-8">{{ contaParaExcluir().valor | currency:'BRL':'symbol':'1.2-2':'pt' }}
                                </dd>
                                <dt class="col-sm-4">Vencimento:</dt>
                                <dd class="col-sm-8">{{ contaParaExcluir().dataVencimento | date:'dd/MM/yyyy' }}</dd>
                            </dl>
                        </div>
                    </div>
                    <div class="text-end">
                        <button type="button" class="btn btn-secondary me-2"
                            (click)="fecharModalExcluirContaReceber()">Cancelar</button>
                        <button type="button" (click)="onConfirmarExclusao()" class="btn btn-danger">
                            Excluir Conta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal: Nova Cobrança Outras Rubricas -->
    <div class="modal fade" [class.show]="isOutrasRubricasModalOpen()" *ngIf="isOutrasRubricasModalOpen()"
        (click)="fecharModalOutrasRubricas()" style="display: block; background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ novaCobrancaOutrasRubricas.id ? 'Editar Cobrança - Outras Rubricas' :
                        'Nova Cobrança - Outras Rubricas' }}</h5>
                    <button type="button" class="btn-close" (click)="fecharModalOutrasRubricas()"></button>
                </div>
                <div class="modal-body">
                    <form (ngSubmit)="onSalvarNovaCobrancaOutrasRubricas()">
                        <div class="mb-3">
                            <label class="form-label">Sócio</label>
                            <input type="text" class="form-control" [value]="transacao()?.socio?.nomeSocio || 'N/A'"
                                disabled>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Data de Vencimento</label>
                            <input type="text" class="form-control"
                                [value]="transacao()?.dataVencimento | date:'dd/MM/yyyy'" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="novaRubricaDescricaoInput" class="form-label">Descrição</label>
                            <input type="text" class="form-control" id="novaRubricaDescricaoInput"
                                [(ngModel)]="novaCobrancaOutrasRubricas.descricao" name="descricao" required>
                        </div>
                        <div class="mb-3">
                            <label for="novaRubricaValorInput" class="form-label">Valor</label>
                            <input type="text" class="form-control" id="novaRubricaValorInput" name="valor"
                                [(ngModel)]="novaCobrancaOutrasRubricas.valor" required placeholder="R$ 0,00"
                                [currencyMask]="{ prefix: 'R$ ', thousands: '.', decimal: ',', allowNegative: false, nullable: true, precision: 2 }">
                        </div>
                        <div class="mb-3">
                            <label for="novaRubricaSelect" class="form-label">Rubrica *</label>
                            <ng-select [(ngModel)]="novaCobrancaOutrasRubricas.rubricaId" name="rubricaId"
                                [clearable]="false" [searchable]="true" [closeOnSelect]="true"
                                placeholder="Selecione uma rubrica" [items]="rubricas()" bindValue="id" bindLabel="nome">
                            </ng-select>
                        </div>
                        <div class="text-end">
                            <button type="button" class="btn btn-secondary me-2"
                                (click)="fecharModalOutrasRubricas()">Cancelar</button>
                            <button type="submit" class="btn btn-success">{{ novaCobrancaOutrasRubricas.id ?
                                'Atualizar
                                Cobrança' : 'Salvar Cobrança' }}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ModaisTransacoesComponent {
  // Signals de controle de modais
  @Input() isAssociarSocioModalOpen!: WritableSignal<boolean>;
  @Input() isNovaContaReceberModalOpen!: WritableSignal<boolean>;
  @Input() isEditContaReceberModalOpen!: WritableSignal<boolean>;
  @Input() isExcluirContaReceberModalOpen!: WritableSignal<boolean>;
  @Input() isOutrasRubricasModalOpen!: WritableSignal<boolean>;

  // Dados compartilhados
  @Input() socios!: WritableSignal<Socio[]>;
  @Input() rubricas!: WritableSignal<Rubrica[]>;
  @Input() transacao: any;

  // Dados do Modal - Associar Sócio
  modalSocioId: number | null = null;

  // Dados do Modal - Nova Conta
  novaConta = {
    rubricaId: null as number | null,
    descricao: '',
    dataVencimento: '',
    valor: 0.0,
  };

  // Dados do Modal - Editar Conta
  editConta: any = {};

  // Dados do Modal - Excluir Conta
  contaParaExcluir: WritableSignal<any | null> = signal(null);

  // Dados do Modal - Outras Rubricas
  novaCobrancaOutrasRubricas: {
    id: number | null;
    descricao: string;
    valor: number;
    rubricaId: number | null;
  } = {
    id: null,
    descricao: '',
    valor: 0.0,
    rubricaId: null,
  };

  // Eventos
  @Output() associarSocio = new EventEmitter<number>();
  @Output() salvarNovaConta = new EventEmitter<any>();
  @Output() salvarEdicaoConta = new EventEmitter<any>();
  @Output() confirmarExclusao = new EventEmitter<void>();
  @Output() salvarNovaCobrancaOutrasRubricas = new EventEmitter<any>();
  @Output() fecharOutrasRubricasModal = new EventEmitter<Cobranca>();

  onAssociarSocio() {
    if (this.modalSocioId) {
      this.associarSocio.emit(this.modalSocioId);
      this.fecharModalAssociarSocio();
    }
  }

  onSalvarNovaConta() {
    this.salvarNovaConta.emit({ ...this.novaConta });
    this.fecharModalNovaContaReceber();
  }

  onSalvarEdicaoConta() {
    this.salvarEdicaoConta.emit({ ...this.editConta });
    this.fecharModalEditContaReceber();
  }

  onConfirmarExclusao() {
    this.confirmarExclusao.emit();
    this.fecharModalExcluirContaReceber();
  }

  onSalvarNovaCobrancaOutrasRubricas() {
    this.salvarNovaCobrancaOutrasRubricas.emit({ ...this.novaCobrancaOutrasRubricas });
    this.fecharModalOutrasRubricas();
  }

  fecharModalAssociarSocio() {
    this.isAssociarSocioModalOpen.set(false);
    this.modalSocioId = null;
  }

  fecharModalNovaContaReceber() {
    this.isNovaContaReceberModalOpen.set(false);
    this.novaConta = {
      rubricaId: null,
      descricao: '',
      dataVencimento: '',
      valor: 0.0,
    };
  }

  fecharModalEditContaReceber() {
    this.isEditContaReceberModalOpen.set(false);
    this.editConta = {};
  }

  fecharModalExcluirContaReceber() {
    this.isExcluirContaReceberModalOpen.set(false);
    this.contaParaExcluir.set(null);
  }

  fecharModalOutrasRubricas() {
    this.isOutrasRubricasModalOpen.set(false);
    this.novaCobrancaOutrasRubricas = {
      id: null,
      descricao: '',
      valor: 0.0,
      rubricaId: null,
    };
  }

  // Método para abrir o modal de outras rubricas para edição
  abrirEditarCobrancaOutrasRubricas(cobranca: Cobranca) {
    this.novaCobrancaOutrasRubricas = {
      id: cobranca.id,
      descricao: cobranca.descricao,
      valor: cobranca.valor,
      rubricaId: cobranca.rubricaId,
    };
    this.isOutrasRubricasModalOpen.set(true);
  }
}