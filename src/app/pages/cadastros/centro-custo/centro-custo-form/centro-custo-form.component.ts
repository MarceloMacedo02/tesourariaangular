import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CentroCusto } from '../centro-custo.model';
import { CentroCustoService } from '../centro-custo.service';

@Component({
  selector: 'app-centro-custo-form',
  templateUrl: './centro-custo-form.component.html',
  styleUrls: ['./centro-custo-form.component.scss']
})
export class CentroCustoFormComponent implements OnInit {
  centroCusto: CentroCusto = {
    nomeCentroCusto: '',
    descricao: '',
    saldoCredito: 0,
    saldoDespesa: 0,
    ativo: true
  };
  
  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private centroCustoService: CentroCustoService
  ) { }

  // Calculated property: Saldo = creditos - saidas
  get saldo(): number {
    const credito = this.centroCusto.saldoCredito || 0;
    const despesa = this.centroCusto.saldoDespesa || 0;
    return credito - despesa;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: this.isEditing ? 'Editar Centro de Custo' : 'Novo Centro de Custo', active: true }
    ];

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.loadCentroCusto(parseInt(id, 10));
    }
  }

  loadCentroCusto(id: number): void {
    this.loading = true;
    this.centroCustoService.getCentroCustoById(id).subscribe({
      next: (data) => {
        this.centroCusto = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar centro de custo:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/centro-custo/lista']);
      }
    });
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação básica
    if (!this.centroCusto.nomeCentroCusto?.trim()) {
      this.errors.push('Nome do centro de custo é obrigatório');
      return;
    }

    if (this.centroCusto.nomeCentroCusto.trim().length > 100) {
      this.errors.push('Nome do centro de custo não pode ter mais de 100 caracteres');
      return;
    }

    if (this.centroCusto.descricao && this.centroCusto.descricao.length > 255) {
      this.errors.push('Descrição não pode ter mais de 255 caracteres');
      return;
    }

    // Validação para saldoCredito
    if (this.centroCusto.saldoCredito !== undefined && this.centroCusto.saldoCredito < 0) {
      this.errors.push('Saldo Crédito não pode ser negativo');
      return;
    }

    // Validação para saldoDespesa
    if (this.centroCusto.saldoDespesa !== undefined && this.centroCusto.saldoDespesa < 0) {
      this.errors.push('Saldo Despesa não pode ser negativo');
      return;
    }

    this.loading = true;

    if (this.isEditing && this.centroCusto.id) {
      this.centroCustoService.updateCentroCusto(this.centroCusto.id, this.centroCusto).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/centro-custo/lista']);
        },
        error: (error) => {
          console.error('Erro ao atualizar centro de custo:', error);
          this.loading = false;
          
          // Verificar se o erro é de autenticação
          if (error.status === 401 || error.status === 403) {
            // O interceptor já tratou o logout, só mostrar uma mensagem mais amigável
            this.errors.push('Sua sessão expirou. Por favor, faça login novamente.');
          } else {
            this.errors.push('Erro ao atualizar centro de custo: ' + (error.error?.message || 'Erro desconhecido'));
          }
        }
      });
    } else {
      this.centroCustoService.createCentroCusto(this.centroCusto).subscribe({
        next: (novoCentroCusto) => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/centro-custo/lista']);
        },
        error: (error) => {
          console.error('Erro ao criar centro de custo:', error);
          this.loading = false;
          
          // Verificar se o erro é de autenticação
          if (error.status === 401 || error.status === 403) {
            // O interceptor já tratou o logout, só mostrar uma mensagem mais amigável
            this.errors.push('Sua sessão expirou. Por favor, faça login novamente.');
          } else {
            this.errors.push('Erro ao criar centro de custo: ' + (error.error?.message || 'Erro desconhecido'));
          }
        }
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/centro-custo/lista']);
  }
}