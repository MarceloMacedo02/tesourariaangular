import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CobrancaAvulsa, Socio, Fornecedor, Rubrica, GrupoMensalidade, ContaFinanceira } from '../financeiro.model';
import { ContasReceberService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-contas-receber-form',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ isEditing ? 'Editar Cobrança' : 'Nova Cobrança' }}</h4>
              </div>
              <div class="card-body">
                <form [formGroup]="cobrancaForm" (ngSubmit)="onSubmit()">
                  <!-- Erros de validação -->
                  <div *ngIf="errors.length > 0" class="alert alert-danger">
                    <ul class="mb-0">
                      <li *ngFor="let error of errors">{{ error }}</li>
                    </ul>
                  </div>

                  <div class="row g-3">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="clienteTipo" class="form-label">
                          Tipo de Cliente *
                        </label>
                        <select class="form-control" id="clienteTipo" formControlName="clienteTipo" required>
                          <option value="">Selecione o tipo de cliente</option>
                          <option value="SOCIO">Sócio</option>
                          <option value="FORNECEDOR">Fornecedor</option>
                        </select>
                      </div>
                    </div>

                    <div class="col-lg-6" *ngIf="cobrancaForm.get('clienteTipo')?.value === 'SOCIO'">
                      <div class="mb-3">
                        <label for="socioId" class="form-label">
                          Sócio *
                        </label>
                        <select class="form-control" id="socioId" formControlName="socioId">
                          <option value="">Selecione um sócio</option>
                          <option *ngFor="let socio of socios" [value]="socio.id">
                            {{ socio.nomeSocio }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-lg-6" *ngIf="cobrancaForm.get('clienteTipo')?.value === 'FORNECEDOR'">
                      <div class="mb-3">
                        <label for="fornecedorId" class="form-label">
                          Fornecedor *
                        </label>
                        <select class="form-control" id="fornecedorId" formControlName="fornecedorId">
                          <option value="">Selecione um fornecedor</option>
                          <option *ngFor="let fornecedor of fornecedores" [value]="fornecedor.id">
                            {{ fornecedor.nomeFantasia }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="rubricaId" class="form-label">
                          Rubrica *
                        </label>
                        <select class="form-control" id="rubricaId" formControlName="rubricaId" required>
                          <option value="">Selecione uma rubrica</option>
                          <option *ngFor="let rubrica of rubricas" [value]="rubrica.id">
                            {{ rubrica.nome }}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div class="col-lg-12">
                      <div class="mb-3">
                        <label for="descricao" class="form-label">
                          Descrição *
                        </label>
                        <textarea class="form-control" id="descricao" formControlName="descricao" rows="3" 
                          required maxlength="500" placeholder="Descrição da cobrança"></textarea>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="valorOriginal" class="form-label">
                          Valor Original *
                        </label>
                        <input type="number" class="form-control" id="valorOriginal" formControlName="valorOriginal" 
                          required min="0.01" step="0.01" placeholder="0.00">
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="dataVencimento" class="form-label">
                          Data de Vencimento *
                        </label>
                        <input type="date" class="form-control" id="dataVencimento" formControlName="dataVencimento" 
                          required>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="dataPagamento" class="form-label">
                          Data de Pagamento
                        </label>
                        <input type="date" class="form-control" id="dataPagamento" formControlName="dataPagamento">
                      </div>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" [disabled]="loading">
                      <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      {{ loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Salvar') }}
                    </button>
                    <button type="button" class="btn btn-light" (click)="cancelar()">
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
export class ContasReceberFormComponent implements OnInit {
  cobrancaForm: FormGroup;
  isEditing = false;
  loading = false;
  errors: string[] = [];
  socios: Socio[] = [];
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  gruposMensalidade: GrupoMensalidade[] = [];
  contasFinanceiras: ContaFinanceira[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contasReceberService: ContasReceberService,
    private dadosAuxiliaresService: DadosAuxiliaresService
  ) {
    this.cobrancaForm = this.fb.group({
      id: [null],
      clienteTipo: ['', Validators.required],
      socioId: [null],
      fornecedorId: [null],
      rubricaId: [null, Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      valorOriginal: [null, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required],
      dataPagamento: [''],
      status: ['ABERTA'],
      tipoCobranca: ['AVULSA']
    });
  }

  ngOnInit(): void {
    this.carregarDadosAuxiliares();
    
    // Verificar se é edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.carregarCobranca(parseInt(id, 10));
    }

    // Adicionar validação condicional para cliente
    this.cobrancaForm.get('clienteTipo')?.valueChanges.subscribe(value => {
      if (value === 'SOCIO') {
        this.cobrancaForm.get('socioId')?.setValidators(Validators.required);
        this.cobrancaForm.get('fornecedorId')?.clearValidators();
      } else if (value === 'FORNECEDOR') {
        this.cobrancaForm.get('fornecedorId')?.setValidators(Validators.required);
        this.cobrancaForm.get('socioId')?.clearValidators();
      } else {
        this.cobrancaForm.get('socioId')?.clearValidators();
        this.cobrancaForm.get('fornecedorId')?.clearValidators();
      }
      this.cobrancaForm.get('socioId')?.updateValueAndValidity();
      this.cobrancaForm.get('fornecedorId')?.updateValueAndValidity();
    });
  }

  carregarDadosAuxiliares(): void {
    this.dadosAuxiliaresService.getSociosAtivos().subscribe({
      next: (socios: Socio[]) => {
        this.socios = socios;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
        this.errors.push('Erro ao carregar sócios: ' + error.message);
      }
    });

    this.dadosAuxiliaresService.getFornecedoresAtivos().subscribe({
      next: (fornecedores: Fornecedor[]) => {
        this.fornecedores = fornecedores;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
        this.errors.push('Erro ao carregar fornecedores: ' + error.message);
      }
    });

    this.dadosAuxiliaresService.getRubricas().subscribe({
      next: (rubricas: Rubrica[]) => {
        this.rubricas = rubricas;
      },
      error: (error) => {
        console.error('Erro ao carregar rubricas:', error);
        this.errors.push('Erro ao carregar rubricas: ' + error.message);
      }
    });

    this.dadosAuxiliaresService.getGruposMensalidade().subscribe({
      next: (grupos: GrupoMensalidade[]) => {
        this.gruposMensalidade = grupos;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos de mensalidade:', error);
        this.errors.push('Erro ao carregar grupos de mensalidade: ' + error.message);
      }
    });

    this.dadosAuxiliaresService.getContasFinanceiras().subscribe({
      next: (contas: ContaFinanceira[]) => {
        this.contasFinanceiras = contas;
      },
      error: (error) => {
        console.error('Erro ao carregar contas financeiras:', error);
        this.errors.push('Erro ao carregar contas financeiras: ' + error.message);
      }
    });
  }

  carregarCobranca(id: number): void {
    this.contasReceberService.obterCobrancaPorId(id).subscribe({
      next: (cobranca: CobrancaAvulsa) => {
        this.cobrancaForm.patchValue({
          ...cobranca,
          clienteTipo: cobranca.socioId ? 'SOCIO' : cobranca.fornecedorId ? 'FORNECEDOR' : ''
        });
      },
      error: (error) => {
        console.error('Erro ao carregar cobrança:', error);
        this.errors.push('Erro ao carregar cobrança: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validar formulário
    if (this.cobrancaForm.invalid) {
      this.errors.push('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.loading = true;
    const formValue = this.cobrancaForm.value;
    const cobranca: CobrancaAvulsa = {
      ...formValue,
      socioId: formValue.clienteTipo === 'SOCIO' ? formValue.socioId : null,
      fornecedorId: formValue.clienteTipo === 'FORNECEDOR' ? formValue.fornecedorId : null,
      tipoCobranca: 'AVULSA'
    };

    if (this.isEditing && cobranca.id) {
      // Atualizar cobrança existente
      this.contasReceberService.criarCobrancaAvulsa(cobranca).subscribe({
        next: (response: CobrancaAvulsa) => {
          this.loading = false;
          alert('Cobrança atualizada com sucesso!');
          this.router.navigate(['/pages/financeiro/contas-receber']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar cobrança:', error);
          this.errors.push('Erro ao atualizar cobrança: ' + error.message);
        }
      });
    } else {
      // Criar nova cobrança
      this.contasReceberService.criarCobrancaAvulsa(cobranca).subscribe({
        next: (response: CobrancaAvulsa) => {
          this.loading = false;
          alert('Cobrança criada com sucesso!');
          this.router.navigate(['/pages/financeiro/contas-receber']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao criar cobrança:', error);
          this.errors.push('Erro ao criar cobrança: ' + error.message);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/contas-receber']);
  }
}