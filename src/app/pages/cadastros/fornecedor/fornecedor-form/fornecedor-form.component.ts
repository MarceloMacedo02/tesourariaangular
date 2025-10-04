import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Fornecedor } from '../fornecedor.model';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-fornecedor-form',
  templateUrl: './fornecedor-form.component.html',
  styleUrls: ['./fornecedor-form.component.scss']
})
export class FornecedorFormComponent implements OnInit {
  // Objeto Fornecedor baseado no DTO do backend
  fornecedor: Fornecedor = {
    nomeFantasia: '',
    cpfCnpj: '',
    razaoSocial: undefined,
    rg: undefined,
    endereco: undefined,
    telefone: undefined,
    email: undefined,
    inscricaoEstadual: undefined,
    observacoes: undefined,
    ativo: true
  };

  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Novo Fornecedor', active: true },
    ];

    // Verificar se é edição
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.breadCrumbItems[1] = { label: 'Editar Fornecedor', active: true };
      this.loadFornecedor(parseInt(id, 10));
    }
  }

  loadFornecedor(id: number): void {
    this.fornecedorService.getFornecedorById(id).subscribe({
      next: (fornecedor: Fornecedor) => {
        this.fornecedor = fornecedor;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedor:', error);
        this.errors.push('Erro ao carregar fornecedor: ' + error.message);
      }
    });
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação dos campos obrigatórios
    if (!this.fornecedor.nomeFantasia) {
      this.errors.push('Nome Fantasia é obrigatório');
    } else if (this.fornecedor.nomeFantasia.length > 100) {
      this.errors.push('Nome Fantasia deve ter no máximo 100 caracteres');
    }
    
    if (!this.fornecedor.cpfCnpj) {
      this.errors.push('CPF/CNPJ é obrigatório');
    } else if (!this.validarCpfCnpj(this.fornecedor.cpfCnpj)) {
      this.errors.push('CPF/CNPJ inválido');
    }
    
    // Validação do email se preenchido
    if (this.fornecedor.email && !this.validarEmail(this.fornecedor.email)) {
      this.errors.push('Email inválido');
    }
    
    // Validação do telefone se preenchido
    if (this.fornecedor.telefone && !this.validarTelefone(this.fornecedor.telefone)) {
      this.errors.push('Telefone inválido');
    }
    
    // Validação do RG se preenchido
    if (this.fornecedor.rg && this.fornecedor.rg.length > 20) {
      this.errors.push('RG deve ter no máximo 20 caracteres');
    }
    
    // Validação do endereço se preenchido
    if (this.fornecedor.endereco && this.fornecedor.endereco.length > 200) {
      this.errors.push('Endereço deve ter no máximo 200 caracteres');
    }
    
    // Validação da razão social se preenchido
    if (this.fornecedor.razaoSocial && this.fornecedor.razaoSocial.length > 150) {
      this.errors.push('Razão Social deve ter no máximo 150 caracteres');
    }
    
    // Validação da inscrição estadual se preenchido
    if (this.fornecedor.inscricaoEstadual && this.fornecedor.inscricaoEstadual.length > 20) {
      this.errors.push('Inscrição Estadual deve ter no máximo 20 caracteres');
    }
    
    // Validação das observações se preenchido
    if (this.fornecedor.observacoes && this.fornecedor.observacoes.length > 500) {
      this.errors.push('Observações devem ter no máximo 500 caracteres');
    }
    
    if (this.errors.length > 0) {
      return;
    }

    this.loading = true;

    if (this.isEditing && this.fornecedor.id) {
      // Atualizar fornecedor existente
      this.fornecedorService.updateFornecedor(this.fornecedor.id, this.fornecedor).subscribe({
        next: (response: Fornecedor) => {
          this.loading = false;
          alert('Fornecedor atualizado com sucesso!');
          this.router.navigate(['/pages/cadastros/fornecedor']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao atualizar fornecedor:', error);
          this.errors.push('Erro ao atualizar fornecedor: ' + error.message);
        }
      });
    } else {
      // Criar novo fornecedor
      this.fornecedorService.createFornecedor(this.fornecedor).subscribe({
        next: (response: Fornecedor) => {
          this.loading = false;
          alert('Fornecedor criado com sucesso!');
          this.router.navigate(['/pages/cadastros/fornecedor']);
        },
        error: (error) => {
          this.loading = false;
          console.error('Erro ao criar fornecedor:', error);
          this.errors.push('Erro ao criar fornecedor: ' + error.message);
        }
      });
    }
  }

  // Formatação de CPF/CNPJ
  formatarCpfCnpj(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é número
    const numeros = value.replace(/\D/g, '');
    
    // Formata como CPF (123.456.789-00) ou CNPJ (12.345.678/0001-90)
    if (numeros.length <= 11) {
      // CPF
      return numeros
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
      // CNPJ
      return numeros
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
  }

  // Formatação de telefone
  formatarTelefone(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é número
    const numeros = value.replace(/\D/g, '');
    
    // Formata como (12) 34567-8901 ou (12) 3456-7890
    if (numeros.length > 10) {
      // Com 9 dígitos no celular
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2');
    } else {
      // Com 8 dígitos
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{4})$/, '$1-$2');
    }
  }

  // Formatação de inscrição estadual
  formatarInscricaoEstadual(value: string): string {
    return value.toUpperCase();
  }
  
  // Validação de CPF/CNPJ
  validarCpfCnpj(value: string): boolean {
    if (!value) return false;
    
    // Remover caracteres especiais
    const numeros = value.replace(/\D/g, '');
    
    // Validar CPF (11 dígitos)
    if (numeros.length === 11) {
      return this.validarCpf(numeros);
    }
    // Validar CNPJ (14 dígitos)
    else if (numeros.length === 14) {
      return this.validarCnpj(numeros);
    }
    
    return false;
  }
  
  // Validação de CPF
  validarCpf(cpf: string): boolean {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    // Calcular primeiro dígito verificador
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    // Calcular segundo dígito verificador
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  }
  
  // Validação de CNPJ
  validarCnpj(cnpj: string): boolean {
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
  }
  
  // Validação de email
  validarEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  // Validação de telefone
  validarTelefone(telefone: string): boolean {
    // Remover caracteres especiais
    const numeros = telefone.replace(/\D/g, '');
    
    // Verificar se tem 10 ou 11 dígitos (fixo ou celular)
    return numeros.length === 10 || numeros.length === 11;
  }
}