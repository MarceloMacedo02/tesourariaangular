import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ContaPagar, Fornecedor, Rubrica, ContaFinanceira } from '../financeiro.model';
import { ContasPagarService, DadosAuxiliaresService } from '../financeiro.service';

@Component({
  selector: 'app-contas-pagar-form',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="card-header">
                <h4 class="card-title mb-0">{{ isEditing ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar' }}</h4>
              </div>
              <div class="card-body">
                <form [formGroup]="contaPagarForm" (ngSubmit)="onSubmit()">
                  <!-- Erros de validação -->
                  <div *ngIf="errors.length > 0" class="alert alert-danger">
                    <ul class="mb-0">
                      <li *ngFor="let error of errors">{{ error }}</li>
                    </ul>
                  </div>

                  <div class="row g-3">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <label for="fornecedorId" class="form-label">
                          Fornecedor *
                        </label>
                        <select class="form-control" id="fornecedorId" formControlName="fornecedorId" required>
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
                          required maxlength="500" placeholder="Descrição da conta a pagar"></textarea>
                      </div>
                    </div>

                    <div class="col-lg-4">
                      <div class="mb-3">
                        <label for="valor" class="form-label">
                          Valor *
                        </label>
                        <input type="number" class="form-control" id="valor" formControlName="valor" 
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
export class ContasPagarFormComponent implements OnInit {
  contaPagarForm: FormGroup;
  isEditing = false;
  loading = false;
  errors: string[] = [];
  fornecedores: Fornecedor[] = [];
  rubricas: Rubrica[] = [];
  contasFinanceiras: ContaFinanceira[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private contasPagarService: ContasPagarService,
    private dadosAuxiliaresService: DadosAuxiliaresService
  ) {
    this.contaPagarForm = this.fb.group({
      id: [null],
      fornecedorId: [null, Validators.required],
      rubricaId: [null, Validators.required],
      descricao: ['', [Validators.required, Validators.maxLength(500)]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', Validators.required],
      dataPagamento: [''],
      status: ['ABERTA']
    });
  }

  ngOnInit(): void {
    this.carregarDadosAuxiliares();
    
    // Verificar se é edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.carregarContaPagar(parseInt(id, 10));
    }
  }

  carregarDadosAuxiliares(): void {
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

  carregarContaPagar(id: number): void {
    this.contasPagarService.obterContaPagarPorId(id).subscribe({
      next: (conta: ContaPagar) => {
        this.contaPagarForm.patchValue(conta);
      },
      error: (error) => {
        console.error('Erro ao carregar conta a pagar:', error);
        this.errors.push('Erro ao carregar conta a pagar: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validar formulário
    if (this.contaPagarForm.invalid) {
      this.errors.push('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    this.loading = true;
    const contaPagar: ContaPagar = this.contaPagarForm.value;

    if (this.isEditing && contaPagar.id) {
      // Atualizar conta a pagar existente
      this.contasPagarService.criarContaPagar(contaPagar).subscribe({
        next: (response: ContaPagar) => {
          this.loading = false;
          alert('Conta a pagar atualizada com sucesso!');
          this.router.navigate(['/pages/financeiro/contas-pagar']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar conta a pagar:', error);
          this.errors.push('Erro ao atualizar conta a pagar: ' + error.message);
        }
      });
    } else {
      // Criar nova conta a pagar
      this.contasPagarService.criarContaPagar(contaPagar).subscribe({
        next: (response: ContaPagar) => {
          this.loading = false;
          alert('Conta a pagar criada com sucesso!');
          this.router.navigate(['/pages/financeiro/contas-pagar']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao criar conta a pagar:', error);
          this.errors.push('Erro ao criar conta a pagar: ' + error.message);
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/pages/financeiro/contas-pagar']);
  }
}