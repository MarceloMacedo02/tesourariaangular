import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Fornecedor } from '../fornecedor.model';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {
  @Input() fornecedor: Fornecedor | null = null;
  @Output() onSave = new EventEmitter<Fornecedor>();
  @Output() onCancel = new EventEmitter<void>();

  fornecedorForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fornecedorForm = this.fb.group({
      nomeFantasia: ['', [Validators.required, Validators.maxLength(100)]],
      razaoSocial: ['', [Validators.maxLength(150)]],
      cpfCnpj: ['', [Validators.required, Validators.maxLength(18), this.cpfCnpjValidator]],
      rg: ['', [Validators.maxLength(20)]],
      endereco: ['', [Validators.maxLength(200)]],
      telefone: ['', [Validators.maxLength(15)]],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      inscricaoEstadual: ['', [Validators.maxLength(20)]],
      observacoes: ['', [Validators.maxLength(500)]],
      ativo: [true]
    });
  }

  ngOnInit(): void {
    if (this.fornecedor) {
      this.fornecedorForm.patchValue(this.fornecedor);
    }
  }

  ngOnChanges(): void {
    if (this.fornecedor) {
      this.fornecedorForm.patchValue(this.fornecedor);
    }
  }

  onSubmit(): void {
    if (this.fornecedorForm.valid) {
      const fornecedorData: Fornecedor = {
        ...this.fornecedor,
        ...this.fornecedorForm.value
      };

      // Se for edição, manter o ID
      if (this.fornecedor?.id) {
        fornecedorData.id = this.fornecedor.id;
      }

      this.onSave.emit(fornecedorData);
    } else {
      // Marcar todos os campos como tocados para mostrar erros
      this.markFormGroupTouched();
    }
  }

  onCancelForm(): void {
    this.onCancel.emit();
  }

  // Validação personalizada para CPF/CNPJ
  cpfCnpjValidator(control: AbstractControl): ValidationErrors | null {
    const cpfCnpj = control.value;
    if (!cpfCnpj) {
      return null; // Se não houver valor, não validar
    }

    // Remover caracteres especiais
    const cleanCpfCnpj = cpfCnpj.replace(/[^\d]/g, '');

    // Validar CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cleanCpfCnpj.length !== 11 && cleanCpfCnpj.length !== 14) {
      return { invalidCpfCnpj: true };
    }

    // Validar CPF
    if (cleanCpfCnpj.length === 11) {
      if (this.isCpfInvalid(cleanCpfCnpj)) {
        return { invalidCpfCnpj: true };
      }
    } 
    // Validar CNPJ
    else if (cleanCpfCnpj.length === 14) {
      if (this.isCnpjInvalid(cleanCpfCnpj)) {
        return { invalidCpfCnpj: true };
      }
    }

    return null;
  }

  // Validação de CPF
  private isCpfInvalid(cpf: string): boolean {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return true;

    let sum = 0;
    let remainder: number;

    // Primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return true;

    // Segundo dígito verificador
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return true;

    return false;
  }

  // Validação de CNPJ
  private isCnpjInvalid(cnpj: string): boolean {
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return true;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return true;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return true;

    return false;
  }

  // Marcar todos os campos do formulário como tocados
  private markFormGroupTouched(): void {
    Object.keys(this.fornecedorForm.controls).forEach(field => {
      const control = this.fornecedorForm.get(field);
      control?.markAsTouched();
    });
  }

  // Getter para facilitar acesso aos controles do formulário
  get formControls() {
    return this.fornecedorForm.controls;
  }

  // Verificar se um campo tem erro específico
  hasError(fieldName: string, errorName: string): boolean {
    const field = this.fornecedorForm.get(fieldName);
    return field ? field.hasError(errorName) && field.touched : false;
  }

  // Obter mensagem de erro específica para um campo
  getErrorMessage(fieldName: string): string {
    const field = this.fornecedorForm.get(fieldName);
    
    if (field?.errors) {
      if (field.errors['required']) {
        const labels: { [key: string]: string } = {
          'nomeFantasia': 'Nome fantasia',
          'cpfCnpj': 'CPF/CNPJ'
        };
        return `${labels[fieldName] || fieldName} é obrigatório`;
      }
      
      if (field.errors['maxlength']) {
        return `${fieldName} excede o número máximo de caracteres`;
      }
      
      if (field.errors['email']) {
        return 'Email inválido';
      }
      
      if (field.errors['invalidCpfCnpj']) {
        return 'CPF/CNPJ inválido';
      }
    }
    
    return '';
  }
}