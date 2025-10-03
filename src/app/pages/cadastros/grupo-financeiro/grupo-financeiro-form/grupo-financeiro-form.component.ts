import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrupoFinanceiro } from '../grupo-financeiro.model';
import { GrupoFinanceiroService } from '../grupo-financeiro.service';

@Component({
  selector: 'app-grupo-financeiro-form',
  templateUrl: './grupo-financeiro-form.component.html',
  styleUrls: ['./grupo-financeiro-form.component.scss']
})
export class GrupoFinanceiroFormComponent implements OnInit {
  // Objeto GrupoFinanceiro com campos de uso exclusivo do backend (dataRegistro e dataAtualizacao)
  // Estes campos são somente leitura no frontend e são gerenciados exclusivamente pelo backend
  grupoFinanceiro: GrupoFinanceiro = {
    nomeGrupoFinanceiro: '',
    descricao: '',
    centroCustoId: undefined as number | undefined, // Inicializado como undefined para o ng-select funcionar corretamente
    ativo: true,
    dataRegistro: undefined,      // Campo de uso exclusivo do backend
    dataAtualizacao: undefined    // Campo de uso exclusivo do backend
  };

  // Variável intermediária para controlar o valor do ng-select
  selectedCentroCustoId: number | null = null;
  
  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;
  centrosCusto: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private grupoFinanceiroService: GrupoFinanceiroService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Novo Grupo Financeiro', active: true }
    ];

    // Load centros de custo for the dropdown
    this.loadCentrosCusto().then(() => {
      // Após carregar os centros de custo, verificar se é edição
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditing = true;
        this.breadCrumbItems[1] = { label: 'Editar Grupo Financeiro', active: true };
        this.loadGrupoFinanceiro(parseInt(id, 10));
      } else {
        // Para novo registro, garantir que o selectedCentroCustoId esteja inicializado
        this.selectedCentroCustoId = null;
      }
    });
  }

  loadCentrosCusto(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.grupoFinanceiroService.getCentrosCusto().subscribe({
        next: (data) => {
          this.centrosCusto = data;
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar centros de custo:', error);
          this.errors.push('Erro ao carregar centros de custo: ' + (error.error?.message || 'Erro desconhecido'));
          reject(error);
        }
      });
    });
  }

  loadGrupoFinanceiro(id: number): void {
    this.loading = true;
    this.grupoFinanceiroService.getGrupoFinanceiroById(id).subscribe({
      next: (data) => {
        this.grupoFinanceiro = data;
        // Garantir que o centroCustoId seja definido corretamente para o ng-select
        if (data.centroCustoId && data.centroCustoId > 0) {
          this.grupoFinanceiro.centroCustoId = data.centroCustoId;
          this.selectedCentroCustoId = data.centroCustoId;
        } else {
          this.selectedCentroCustoId = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupo financeiro:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
      }
    });
  }

  // Método chamado quando o centro de custo é selecionado no ng-select
  onCentroCustoChange(event: any): void {
    // Atualiza o centroCustoId com o ID do centro de custo selecionado
    this.selectedCentroCustoId = event?.id || null;
    this.grupoFinanceiro.centroCustoId = event?.id || undefined;
    console.log('Centro de custo selecionado:', event, 'selectedCentroCustoId:', this.selectedCentroCustoId, 'grupoFinanceiro.centroCustoId:', this.grupoFinanceiro.centroCustoId);
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação básica
    if (!this.grupoFinanceiro.nomeGrupoFinanceiro?.trim()) {
      this.errors.push('Nome do grupo financeiro é obrigatório');
      return;
    }

    if (this.grupoFinanceiro.nomeGrupoFinanceiro.trim().length > 100) {
      this.errors.push('Nome do grupo financeiro não pode ter mais de 100 caracteres');
      return;
    }

    if (this.grupoFinanceiro.descricao && this.grupoFinanceiro.descricao.length > 255) {
      this.errors.push('Descrição não pode ter mais de 255 caracteres');
      return;
    }

    if (this.selectedCentroCustoId === null || this.selectedCentroCustoId === undefined || this.selectedCentroCustoId <= 0) {
      this.errors.push('Centro de custo é obrigatório');
      console.log('Valor do selectedCentroCustoId:', this.selectedCentroCustoId, 'grupoFinanceiro.centroCustoId:', this.grupoFinanceiro.centroCustoId);
      return;
    }
    // Atualizar o modelo com o valor selecionado antes de enviar
    this.grupoFinanceiro.centroCustoId = this.selectedCentroCustoId;

    this.loading = true;

    if (this.isEditing && this.grupoFinanceiro.id) {
      this.grupoFinanceiroService.updateGrupoFinanceiro(this.grupoFinanceiro.id, this.grupoFinanceiro).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
        },
        error: (error) => {
          console.error('Erro ao atualizar grupo financeiro:', error);
          this.loading = false;
          this.errors.push('Erro ao atualizar grupo financeiro: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    } else {
      this.grupoFinanceiroService.createGrupoFinanceiro(this.grupoFinanceiro).subscribe({
        next: (novoGrupoFinanceiro) => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
        },
        error: (error) => {
          console.error('Erro ao criar grupo financeiro:', error);
          this.loading = false;
          this.errors.push('Erro ao criar grupo financeiro: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/grupo-financeiro/lista']);
  }
}