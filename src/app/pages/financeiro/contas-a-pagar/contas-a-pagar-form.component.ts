import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Fornecedor,
  ReferenciasFinanceirasService,
  Rubrica,
  Socio,
} from '../../../services/referencias-financeiras.service';
import {
  ContaPagar,
  ContasPagarService,
  NovaContaPagar,
} from './contas-a-pagar.service';

@Component({
  selector: 'app-contas-a-pagar-form',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">
                  {{ isEdicao ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar' }}
                </h4>
              </div>
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <!-- Erros de validação -->
                  <div *ngIf="errors.length > 0" class="alert alert-danger">
                    <ul class="mb-0">
                      <li *ngFor="let error of errors">{{ error }}</li>
                    </ul>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="socioId" class="form-label">Sócio</label>
                        <ng-select
                          [(ngModel)]="selectedSocioId"
                          [disabled]="isEdicao || loading"
                          [clearable]="false"
                          [searchable]="true"
                          [closeOnSelect]="true"
                          placeholder="Selecione um sócio"
                          [items]="socios"
                          bindValue="id"
                          bindLabel="nome"
                          (change)="onSocioChange($event)"
                        >
                        </ng-select>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="fornecedorId" class="form-label"
                          >Fornecedor</label
                        >
                        <ng-select
                          [(ngModel)]="selectedFornecedorId"
                          [disabled]="isEdicao || loading"
                          [clearable]="false"
                          [searchable]="true"
                          [closeOnSelect]="true"
                          placeholder="Selecione um fornecedor"
                          [items]="fornecedores"
                          bindValue="id"
                          bindLabel="nome"
                          (change)="onFornecedorChange($event)"
                        >
                        </ng-select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="rubricaId" class="form-label"
                          >Rubrica *</label
                        >
                        <ng-select
                          [(ngModel)]="selectedRubricaId"
                          [disabled]="loading"
                          [clearable]="false"
                          [searchable]="true"
                          [closeOnSelect]="true"
                          placeholder="Selecione uma rubrica"
                          [items]="rubricas"
                          bindValue="id"
                          bindLabel="nome"
                          formControlName="rubricaId"
                        >
                        </ng-select>
                        <div
                          *ngIf="
                            form.get('rubricaId')?.invalid &&
                            form.get('rubricaId')?.touched
                          "
                          class="text-danger"
                        >
                          Rubrica é obrigatória
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="descricao" class="form-label"
                          >Descrição *</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="descricao"
                          formControlName="descricao"
                          [disabled]="loading"
                        />
                        <div
                          *ngIf="
                            form.get('descricao')?.invalid &&
                            form.get('descricao')?.touched
                          "
                          class="text-danger"
                        >
                          Descrição é obrigatória
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="valor" class="form-label">Valor *</label>
                        <input
                          type="text"
                          class="form-control"
                          id="valor"
                          name="valor"
                          [(ngModel)]="valor"
                          [disabled]="loading"
                          required
                          placeholder="R$ 0,00"
                          [currencyMask]="{
                            prefix: 'R$ ',
                            thousands: '.',
                            decimal: ',',
                            allowNegative: false,
                            nullable: true,
                            precision: 2
                          }"
                          formControlName="valor"
                        />
                        <div
                          *ngIf="
                            form.get('valor')?.invalid &&
                            form.get('valor')?.touched
                          "
                          class="text-danger"
                        >
                          Valor é obrigatório e deve ser positivo
                        </div>
                      </div>
                    </div>

                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="dataVencimento" class="form-label"
                          >Data de Vencimento *</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="dataVencimento"
                          name="dataVencimento"
                          [(ngModel)]="dataVencimento"
                          [disabled]="loading"
                          placeholder="dd/mm/aaaa"
                          mwlFlatpickr
                          [altInput]="true"
                          [convertModelValue]="true"
                          [dateFormat]="'Y-m-d'"
                          altFormat="d/m/Y"
                          formControlName="dataVencimento"
                        />
                        <div
                          *ngIf="
                            form.get('dataVencimento')?.invalid &&
                            form.get('dataVencimento')?.touched
                          "
                          class="text-danger"
                        >
                          Data de vencimento é obrigatória
                        </div>
                      </div>
                    </div>

                    <div
                      class="col-md-4"
                      *ngIf="isEdicao && conta?.dataPagamento"
                    >
                      <div class="mb-3">
                        <label for="dataPagamento" class="form-label"
                          >Data de Pagamento</label
                        >
                        <input
                          type="text"
                          class="form-control"
                          id="dataPagamento"
                          name="dataPagamento"
                          [(ngModel)]="dataPagamento"
                          [disabled]="true"
                          placeholder="dd/mm/aaaa"
                          mwlFlatpickr
                          [altInput]="true"
                          [convertModelValue]="true"
                          [dateFormat]="'Y-m-d'"
                          altFormat="d/m/Y"
                        />
                      </div>
                    </div>
                  </div>

                  <div class="mb-3" *ngIf="isEdicao && conta">
                    <label class="form-label">Status</label>
                    <div
                      class="form-control"
                      [ngClass]="'status-' + conta.status.toLowerCase()"
                      readonly
                    >
                      {{ conta.status | titlecase }}
                    </div>
                  </div>

                  <div class="d-flex justify-content-between">
                    <button
                      type="button"
                      class="btn btn-secondary"
                      (click)="cancelar()"
                      [disabled]="loading"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      class="btn btn-primary"
                      [disabled]="
                        form.invalid || loading || (!isEdicao && contaExiste)
                      "
                    >
                      {{
                        loading
                          ? 'Salvando...'
                          : isEdicao
                          ? 'Atualizar'
                          : 'Criar'
                      }}
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
  styles: [
    `
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
    `,
  ],
})
export class ContasPagarFormComponent implements OnInit {
  form: FormGroup;
  isEdicao = false;
  contaId: number | null = null;
  conta: ContaPagar | null = null;
  contaExiste = false;
  loading = false;
  errors: string[] = [];
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  socios: Socio[] = [];
  selectedFornecedorId: number | null = null;
  selectedRubricaId: number | null = null;
  selectedSocioId: number | null = null;
  valor: number | null = null;
  dataVencimento: string | null = null;
  dataPagamento: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contasPagarService: ContasPagarService,
    private referenciasFinanceirasService: ReferenciasFinanceirasService
  ) {
    this.form = this.fb.group({
      fornecedorId: [''],
      rubricaId: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.contaId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEdicao = !!this.contaId;

    // Carregar dados necessários para os selects
    this.loadData().then(() => {
      if (this.isEdicao) {
        this.loadConta();
      }
    });
  }

  async loadData(): Promise<void> {
    try {
      // Carregar fornecedores do backend
      this.fornecedores =
        (await this.referenciasFinanceirasService
          .getFornecedores()
          .toPromise()) || [];
    } catch (error: any) {
      console.error('Erro ao carregar fornecedores:', error);
      this.errors.push(
        'Erro ao carregar fornecedores: ' +
          (error.error?.message || 'Erro desconhecido')
      );
    }

    try {
      // Carregar rubricas do backend
      this.rubricas =
        (await this.referenciasFinanceirasService.getRubricas().toPromise()) ||
        [];
    } catch (error: any) {
      console.error('Erro ao carregar rubricas:', error);
      this.errors.push(
        'Erro ao carregar rubricas: ' +
          (error.error?.message || 'Erro desconhecido')
      );
    }

    try {
      // Carregar sócios do backend
      this.socios =
        (await this.referenciasFinanceirasService.getSocios().toPromise()) ||
        [];
    } catch (error: any) {
      console.error('Erro ao carregar sócios:', error);
      this.errors.push(
        'Erro ao carregar sócios: ' +
          (error.error?.message || 'Erro desconhecido')
      );
    }
  }

  loadConta(): void {
    this.contasPagarService.getById(this.contaId!).subscribe({
      next: (data) => {
        this.conta = data;
        this.contaExiste = true;
        this.form.patchValue({
          fornecedorId: data.fornecedorId,
          rubricaId: data.rubricaId,
          descricao: data.descricao,
          valor: data.valor,
          dataVencimento: data.dataVencimento,
        });
        // Preencher os campos do modelo
        this.selectedFornecedorId = data.fornecedorId;
        this.selectedRubricaId = data.rubricaId;
        this.valor = data.valor;
        this.dataVencimento = data.dataVencimento;
        this.dataPagamento = data.dataPagamento || null;

        this.form.get('fornecedorId')?.disable();
        this.form.get('rubricaId')?.disable();
      },
      error: (error) => {
        console.error('Erro ao carregar conta a pagar:', error);
        this.router.navigate(['/pages/financeiro/contas-a-pagar/lista']);
      },
    });
  }

  onSocioChange(event: any): void {
    this.selectedSocioId = event?.id || null;
    if (this.selectedSocioId) {
      this.selectedFornecedorId = null; // Limpar fornecedor se sócio for selecionado
      this.form.get('fornecedorId')?.setValue('');
    }
  }

  onFornecedorChange(event: any): void {
    this.selectedFornecedorId = event?.id || null;
    if (this.selectedFornecedorId) {
      this.selectedSocioId = null; // Limpar sócio se fornecedor for selecionado
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errors = [];

    const formData = this.form.value;
    const contaData: NovaContaPagar = {
      fornecedorId: this.selectedFornecedorId || formData.fornecedorId,
      rubricaId: this.selectedRubricaId || formData.rubricaId,
      descricao: formData.descricao,
      valor: this.valor || formData.valor,
      dataVencimento: this.dataVencimento || formData.dataVencimento,
    };

    if (this.isEdicao && this.contaId) {
      // Atualização (em implementação real, poderia haver campos editáveis)
      console.log('Atualizando conta:', this.contaId, contaData);
    } else {
      // Criação
      this.contasPagarService.create(contaData).subscribe({
        next: (novaConta) => {
          console.log('Conta criada com sucesso:', novaConta);
          this.router.navigate(['/pages/financeiro/contas-a-pagar/lista']);
        },
        error: (error) => {
          console.error('Erro ao criar conta a pagar:', error);
          this.errors.push(
            error.error?.message || 'Erro ao criar conta a pagar'
          );
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/contas-a-pagar/lista']);
  }
}
