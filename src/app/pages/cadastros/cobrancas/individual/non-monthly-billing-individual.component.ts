import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Socio } from '../../socio/socio.model';
import { Rubrica } from '../../rubricas/rubricas.model';
import { SocioService } from '../../socio/socio.service';
import { RubricasService } from '../../rubricas/rubricas.service';
import { NonMonthlyBillingService } from '../non-monthly-billing.service';
import { Cobranca } from '../non-monthly-billing.model';

@Component({
  selector: 'app-non-monthly-billing-individual',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Geração de Cobrança Outras Rubricas</h4>
              </div>
              <div class="card-body">
                <form [formGroup]="billingForm" (ngSubmit)="generateBilling()">
                  <div class="row g-3">
                    <div class="col-lg-6">
                      <label for="socioId" class="form-label">Sócio *</label>
                      <ng-select 
                        [(ngModel)]="selectedSocioId"
                        [items]="socios"
                        bindLabel="nomeSocio"
                        bindValue="id"
                        placeholder="Selecione um sócio"
                        [disabled]="loadingSocios"
                        [clearable]="false"
                        [searchable]="true"
                        [closeOnSelect]="true"
                        (change)="onSocioChange($event)">
                      </ng-select>
                      <div *ngIf="billingForm.get('socioId')?.invalid && billingForm.get('socioId')?.touched" 
                           class="text-danger mt-1">
                        Sócio é obrigatório
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="rubricaId" class="form-label">Rubrica *</label>
                      <ng-select 
                        [(ngModel)]="selectedRubricaId"
                        [items]="rubricas"
                        bindLabel="nome"
                        bindValue="id"
                        placeholder="Selecione uma rubrica"
                        [disabled]="loadingRubricas"
                        [clearable]="false"
                        [searchable]="true"
                        [closeOnSelect]="true"
                        (change)="onRubricaChange($event)">
                      </ng-select>
                      <div *ngIf="billingForm.get('rubricaId')?.invalid && billingForm.get('rubricaId')?.touched" 
                           class="text-danger mt-1">
                        Rubrica é obrigatória
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="descricao" class="form-label">Descrição</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="descricao" 
                        formControlName="descricao" 
                        placeholder="Descrição da cobrança">
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="valor" class="form-label">Valor *</label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="valor"
                        formControlName="valor"
                        placeholder="R$ 0,00"
                        [currencyMask]="{ prefix: 'R$ ', thousands: '.', decimal: ',', allowNegative: false, nullable: true, precision: 2 }">
                      <div *ngIf="billingForm.get('valor')?.invalid && billingForm.get('valor')?.touched" 
                           class="text-danger mt-1">
                        Valor é obrigatório e deve ser maior que zero
                      </div>
                    </div>
                    
                    <div class="col-lg-6">
                      <label for="dataVencimento" class="form-label">Data de Vencimento *</label>
                      <input 
                        type="text"
                        class="form-control"
                        id="dataVencimento"
                        formControlName="dataVencimento"
                        [disabled]="loading"
                        placeholder="dd/mm/aaaa"
                        mwlFlatpickr
                        [altInput]="true"
                        [convertModelValue]="true"
                        [dateFormat]="'Y-m-d'"
                        altFormat="d/m/Y">
                      <div *ngIf="billingForm.get('dataVencimento')?.invalid && billingForm.get('dataVencimento')?.touched" 
                           class="text-danger mt-1">
                        Data de vencimento é obrigatória
                      </div>
                    </div>

                    <div class="col-12">
                      <button 
                        type="submit" 
                        class="btn btn-primary w-100" 
                        [disabled]="billingForm.invalid || loading">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {{ loading ? 'Gerando Cobrança...' : 'Gerar Cobrança de Outras Rubricas' }}
                      </button>
                    </div>
                  </div>
                </form>
                
                <!-- Resultado da geração -->
                <div *ngIf="resultadoGeracao" class="mt-4">
                  <div class="alert" [class.alert-success]="!erroGeracao" [class.alert-danger]="erroGeracao">
                    <h5 class="alert-heading">{{ erroGeracao ? 'Erro' : 'Sucesso' }}</h5>
                    <p>{{ resultadoGeracao }}</p>
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
export class NonMonthlyBillingIndividualComponent implements OnInit {
  billingForm: FormGroup;
  selectedSocioId: number | null = null;
  selectedRubricaId: number | null = null;
  socios: Socio[] = [];
  rubricas: Rubrica[] = [];
  loading = false;
  loadingSocios = false;
  loadingRubricas = false;
  resultadoGeracao: string | null = null;
  erroGeracao = false;

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService,
    private rubricaService: RubricasService,
    private billingService: NonMonthlyBillingService,
    private router: Router
  ) {
    this.billingForm = this.formBuilder.group({
      descricao: [''],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      dataVencimento: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadSocios();
    this.loadRubricas();
  }

  loadSocios(): void {
    this.loadingSocios = true;
    this.socioService.getSocios(0, 1000).subscribe({
      next: (response) => {
        this.socios = response.content;
        this.loadingSocios = false;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
        this.loadingSocios = false;
      }
    });
  }

  loadRubricas(): void {
    this.loadingRubricas = true;
    this.rubricaService.getRubricas(0, 1000).subscribe({
      next: (response) => {
        this.rubricas = response.content;
        this.loadingRubricas = false;
      },
      error: (error) => {
        console.error('Erro ao carregar rubricas:', error);
        this.loadingRubricas = false;
      }
    });
  }

  onSocioChange(event: any): void {
    this.selectedSocioId = event?.id || null;
    console.log('Sócio selecionado:', event, 'selectedSocioId:', this.selectedSocioId);
  }

  onRubricaChange(event: any): void {
    this.selectedRubricaId = event?.id || null;
    console.log('Rubrica selecionada:', event, 'selectedRubricaId:', this.selectedRubricaId);
  }

  generateBilling(): void {
    // Set the form values for socioId and rubricaId from the ng-select model values
    this.billingForm.get('socioId')?.setValue(this.selectedSocioId);
    this.billingForm.get('rubricaId')?.setValue(this.selectedRubricaId);

    if (this.billingForm.invalid || !this.selectedSocioId || !this.selectedRubricaId) {
      // Mark all fields as touched to show validation errors
      this.billingForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.resultadoGeracao = null;
    this.erroGeracao = false;

    const formData = this.billingForm.value;
    
    // Use the new service method for OUTRAS_RUBRICAS
    this.billingService.createOutrasRubricasBilling(
      this.selectedSocioId,
      this.selectedRubricaId,
      formData.valor,
      formData.dataVencimento,
      formData.descricao
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.resultadoGeracao = `Cobrança gerada com sucesso para o sócio: ${response.socioNome || this.selectedSocioId}, rubrica: ${response.rubricaNome || this.selectedRubricaId}`;
        
        // Clear form after successful creation
        this.billingForm.reset();
        this.selectedSocioId = null;
        this.selectedRubricaId = null;
        
        // Clear the validation errors
        Object.keys(this.billingForm.controls).forEach(key => {
          this.billingForm.get(key)?.setErrors(null);
        });
      },
      error: (error) => {
        this.loading = false;
        this.erroGeracao = true;
        this.resultadoGeracao = `Erro ao gerar cobrança: ${error.error?.message || 'Erro desconhecido'}`;
        console.error('Erro ao gerar cobrança:', error);
      }
    });
  }
}