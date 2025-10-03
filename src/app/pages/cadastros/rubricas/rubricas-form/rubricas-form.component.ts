import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rubrica } from '../rubricas.model';
import { RubricasService } from '../rubricas.service';

@Component({
  selector: 'app-rubricas-form',
  templateUrl: './rubricas-form.component.html',
  styleUrls: ['./rubricas-form.component.scss']
})
export class RubricasFormComponent implements OnInit {
  // Objeto Rubrica com campo de uso exclusivo do backend (dataCriacao)
  // Este campo é somente leitura no frontend e é gerenciado exclusivamente pelo backend
  rubrica: Rubrica = {
    valor: 0,
    nome: '',
    tipo: 'RECEITA', // Valor padrão
    descricao: '',
    ativo: true,
    grupoFinanceiroId: undefined as number | undefined, // Inicializado como undefined para o ng-select funcionar corretamente
    dataCriacao: undefined // Campo de uso exclusivo do backend
  };

  // Variável intermediária para controlar o valor do ng-select de grupo financeiro
  selectedGrupoFinanceiroId: number | null = null;
  
  isEditing = false;
  loading = false;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;
  gruposFinanceiros: any[] = [];
  tiposDisponiveis = [
    { id: 'RECEITA', nome: 'Receita' },
    { id: 'DESPESA', nome: 'Despesa' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rubricasService: RubricasService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Nova Rubrica', active: true }
    ];

    // Load grupos financeiros for the dropdown
    this.loadGruposFinanceiros().then(() => {
      // Após carregar os grupos financeiros, verificar se é edição
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.isEditing = true;
        this.breadCrumbItems[1] = { label: 'Editar Rubrica', active: true };
        this.loadRubrica(parseInt(id, 10));
      } else {
        // Para novo registro, garantir que o selectedGrupoFinanceiroId esteja inicializado
        this.selectedGrupoFinanceiroId = null;
      }
    });
  }

  loadGruposFinanceiros(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.rubricasService.getGruposFinanceiros().subscribe({
        next: (data) => {
          this.gruposFinanceiros = data;
          console.log('Grupos financeiros carregados:', data);
          resolve();
        },
        error: (error) => {
          console.error('Erro ao carregar grupos financeiros:', error);
          if (error.status === 403 || error.status === 401) {
            // Erro de autenticação, o interceptor já deve lidar com o logout
            console.log('Erro de autenticação ao carregar grupos financeiros');
          }
          this.errors.push('Erro ao carregar grupos financeiros: ' + (error.error?.message || 'Erro desconhecido'));
          reject(error);
        }
      });
    });
  }

  loadRubrica(id: number): void {
    this.loading = true;
    this.rubricasService.getRubricaById(id).subscribe({
      next: (data) => {
        this.rubrica = data;
        // Garantir que o grupoFinanceiroId seja definido corretamente para o ng-select
        if (data.grupoFinanceiroId && data.grupoFinanceiroId > 0) {
          this.rubrica.grupoFinanceiroId = data.grupoFinanceiroId;
          this.selectedGrupoFinanceiroId = data.grupoFinanceiroId;
        } else {
          this.selectedGrupoFinanceiroId = null;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar rubrica:', error);
        this.loading = false;
        // Redirecionar de volta para a lista em caso de erro
        this.router.navigate(['/pages/cadastros/rubricas']);
      }
    });
  }

  // Método chamado quando o grupo financeiro é selecionado no ng-select
  onGrupoFinanceiroChange(event: any): void {
    // Atualiza o grupoFinanceiroId com o ID do grupo financeiro selecionado
    this.selectedGrupoFinanceiroId = event?.id || null;
    this.rubrica.grupoFinanceiroId = event?.id || undefined;
    console.log('Grupo financeiro selecionado:', event, 'selectedGrupoFinanceiroId:', this.selectedGrupoFinanceiroId, 'rubrica.grupoFinanceiroId:', this.rubrica.grupoFinanceiroId);
  }

  // Método chamado quando o campo valor perde o foco
  onValorChange(event: any): void {
    // A diretiva currencyMask já converte o valor formatado para número automaticamente
    // O valor já está disponível em this.rubrica.valor
  }

  onSubmit(): void {
    this.errors = [];
    
    // Validação básica
    if (!this.rubrica.nome?.trim()) {
      this.errors.push('Nome da rubrica é obrigatório');
      return;
    }

    if (this.rubrica.nome.trim().length > 100) {
      this.errors.push('Nome da rubrica não pode ter mais de 100 caracteres');
      return;
    }

    if (this.rubrica.descricao && this.rubrica.descricao.length > 255) {
      this.errors.push('Descrição não pode ter mais de 255 caracteres');
      return;
    }

    if (this.rubrica.valor === undefined || this.rubrica.valor < 0) {
      this.errors.push('Valor da rubrica é obrigatório e deve ser maior ou igual a zero');
      return;
    }

    if (this.selectedGrupoFinanceiroId === null || this.selectedGrupoFinanceiroId === undefined || this.selectedGrupoFinanceiroId <= 0) {
      this.errors.push('Grupo financeiro é obrigatório');
      console.log('Valor do selectedGrupoFinanceiroId:', this.selectedGrupoFinanceiroId, 'rubrica.grupoFinanceiroId:', this.rubrica.grupoFinanceiroId);
      return;
    }
    // Atualizar o modelo com o valor selecionado antes de enviar
    this.rubrica.grupoFinanceiroId = this.selectedGrupoFinanceiroId as number;

    this.loading = true;

    if (this.isEditing && this.rubrica.id) {
      this.rubricasService.updateRubrica(this.rubrica.id, this.rubrica).subscribe({
        next: () => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/rubricas']);
        },
        error: (error) => {
          console.error('Erro ao atualizar rubrica:', error);
          this.loading = false;
          this.errors.push('Erro ao atualizar rubrica: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    } else {
      this.rubricasService.createRubrica(this.rubrica).subscribe({
        next: (novaRubrica) => {
          this.loading = false;
          // Redirecionar para a lista após salvar
          this.router.navigate(['/pages/cadastros/rubricas']);
        },
        error: (error) => {
          console.error('Erro ao criar rubrica:', error);
          this.loading = false;
          this.errors.push('Erro ao criar rubrica: ' + (error.error?.message || 'Erro desconhecido'));
        }
      });
    }
  }

  onCancel(): void {
    // Redirecionar de volta para a lista
    this.router.navigate(['/pages/cadastros/rubricas']);
  }
}