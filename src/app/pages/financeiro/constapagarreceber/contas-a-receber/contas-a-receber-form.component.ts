import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contas-a-receber-form',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">
                  {{ isEditing ? 'Editar Conta a Receber' : 'Nova Conta a Receber' }}
                </h4>
              </div>
              <div class="card-body">
                <form [formGroup]="form" (ngSubmit)="onSubmit()">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="descricao" class="form-label">Descrição</label>
                        <input
                          type="text"
                          class="form-control"
                          id="descricao"
                          formControlName="descricao"
                          placeholder="Informe a descrição"
                        />
                        <div
                          *ngIf="form.get('descricao')?.invalid && form.get('descricao')?.touched"
                          class="text-danger"
                        >
                          Descrição é obrigatória
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="valor" class="form-label">Valor</label>
                        <input
                          type="text"
                          class="form-control"
                          id="valor"
                          formControlName="valor"
                          placeholder="0,00"
                        />
                        <div
                          *ngIf="form.get('valor')?.invalid && form.get('valor')?.touched"
                          class="text-danger"
                        >
                          Valor é obrigatório
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="dataVencimento" class="form-label">Data de Vencimento</label>
                        <input
                          type="date"
                          class="form-control"
                          id="dataVencimento"
                          formControlName="dataVencimento"
                        />
                        <div
                          *ngIf="form.get('dataVencimento')?.invalid && form.get('dataVencimento')?.touched"
                          class="text-danger"
                        >
                          Data de vencimento é obrigatória
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select class="form-select" id="status" formControlName="status">
                          <option value="PENDENTE">Pendente</option>
                          <option value="PAGO">Pago</option>
                          <option value="CANCELADO">Cancelado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="categoria" class="form-label">Categoria</label>
                        <select class="form-select" id="categoria" formControlName="categoria">
                          <option value="">Selecione uma categoria</option>
                          <option value="RECEITA">Receita</option>
                          <option value="OUTROS">Outros</option>
                        </select>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="mb-3">
                        <label for="formaPagamento" class="form-label">Forma de Pagamento</label>
                        <select class="form-select" id="formaPagamento" formControlName="formaPagamento">
                          <option value="">Selecione a forma</option>
                          <option value="DINHEIRO">Dinheiro</option>
                          <option value="PIX">PIX</option>
                          <option value="BOLETO">Boleto</option>
                          <option value="CARTAO">Cartão</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-12">
                      <div class="mb-3">
                        <label for="observacoes" class="form-label">Observações</label>
                        <textarea
                          class="form-control"
                          id="observacoes"
                          formControlName="observacoes"
                          rows="3"
                          placeholder="Observações adicionais"
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-success" [disabled]="form.invalid">
                      {{ isEditing ? 'Atualizar' : 'Salvar' }}
                    </button>
                    <button type="button" class="btn btn-secondary" (click)="onCancel()">
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
export class ContasAReceberFormComponent implements OnInit {
  form: FormGroup;
  isEditing = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      descricao: ['', Validators.required],
      valor: ['', Validators.required],
      dataVencimento: ['', Validators.required],
      status: ['PENDENTE', Validators.required],
      categoria: [''],
      formaPagamento: [''],
      observacoes: ['']
    });
  }

  ngOnInit(): void {
    // Check if editing by looking at route parameters
    // This would be implemented based on actual routing
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Formulário enviado:', this.form.value);
      // Implement the actual save/update logic here
    }
  }

  onCancel(): void {
    console.log('Cancelado');
    // Navigate back to the list page
  }
}