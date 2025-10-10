import { Component, OnInit } from '@angular/core';
import { Rubrica, Page } from './rubricas.model';
import { RubricasService } from './rubricas.service';

/**
 * Componente de listagem de Rubricas
 * Campo dataCriacao é de uso exclusivo do backend e é exibido apenas para informação
 */
@Component({
  selector: 'app-rubricas',
  templateUrl: './rubricas.component.html',
  styleUrls: ['./rubricas.component.scss']
})
export class RubricasComponent implements OnInit {
  rubricas: Rubrica[] = [];  // Array de rubricas retornadas pela API
  page: Page<Rubrica> = {} as Page<Rubrica>;  // Objeto de paginação
  currentPage = 0;  // Página atual na navegação
  pageSize = 30;  // Número de itens por página
  filtro = '';  // Filtro de busca
  loading = false;  // Indicador de carregamento
  breadCrumbItems!: Array<{}>;  // Itens do breadcrumb
  gruposFinanceiros: any[] = []; // Lista de grupos financeiros para o ng-select
  editandoGrupoFinanceiro: { [key: string]: boolean } = {}; // Controle de edição inline (usando string como chave)
  grupoFinanceiroSelecionado: { [key: string]: number | null } = {}; // Armazena seleção do grupo financeiro por rubrica (usando string como chave)

  constructor(private rubricasService: RubricasService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Rubricas', active: true }
    ];
    
    this.loadRubricas();
  }

  loadRubricas(): void {
    this.loading = true;
    
    // Primeiro carregamos os grupos financeiros para mapear os nomes e usar no inline edit
    this.rubricasService.getGruposFinanceiros().subscribe({
      next: (gruposFinanceiros) => {
        this.gruposFinanceiros = gruposFinanceiros;
        
        // Depois carregamos as rubricas
        this.rubricasService.getRubricas(this.currentPage, this.pageSize, this.filtro)
          .subscribe({
            next: (response) => {
              this.page = response;
              // Enriquecer as rubricas com os nomes dos grupos financeiros
              this.rubricas = response.content.map(rubrica => {
                const grupo = gruposFinanceiros.find((g: any) => g.id === rubrica.grupoFinanceiroId);
                return {
                  ...rubrica,
                  grupoFinanceiroNome: grupo ? grupo.nomeGrupoFinanceiro : undefined
                };
              });
              
              // Inicializar os estados de edição e seleção
              this.editandoGrupoFinanceiro = {};
              this.grupoFinanceiroSelecionado = {};
              this.rubricas.forEach(rubrica => {
                if (rubrica.id) {
                  this.editandoGrupoFinanceiro[rubrica.id.toString()] = false;
                  this.grupoFinanceiroSelecionado[rubrica.id.toString()] = rubrica.grupoFinanceiroId || null;
                }
              });
              
              this.loading = false;
            },
            error: (error) => {
              console.error('Erro ao carregar rubricas:', error);
              this.loading = false;
            }
          });
      },
      error: (error) => {
        console.error('Erro ao carregar grupos financeiros:', error);
        // Mesmo com erro nos grupos financeiros, ainda carregamos as rubricas
        this.rubricasService.getRubricas(this.currentPage, this.pageSize, this.filtro)
          .subscribe({
            next: (response) => {
              this.page = response;
              this.rubricas = response.content;
              
              // Inicializar os estados de edição e seleção mesmo sem grupos financeiros
              this.editandoGrupoFinanceiro = {};
              this.grupoFinanceiroSelecionado = {};
              this.rubricas.forEach(rubrica => {
                if (rubrica.id) {
                  this.editandoGrupoFinanceiro[rubrica.id.toString()] = false;
                  this.grupoFinanceiroSelecionado[rubrica.id.toString()] = rubrica.grupoFinanceiroId || null;
                }
              });
              
              this.loading = false;
            },
            error: (error) => {
              console.error('Erro ao carregar rubricas:', error);
              this.loading = false;
            }
          });
      }
    });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadRubricas();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadRubricas();
  }

  getStatusText(ativo: boolean): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  getStatusBadgeClass(ativo: boolean): string {
    return ativo ? 'bg-success' : 'bg-danger';
  }

  getVisiblePages(): number[] {
    const totalPages = this.page.totalPages;
    const currentPage = this.currentPage;
    
    if (totalPages <= 7) {
      // Se tiver 7 ou menos páginas, mostrar todas
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Caso contrário, mostrar com abreviação
    const pages = [];
    
    // Primeira página sempre visível
    pages.push(0);
    
    if (currentPage > 3) {
      pages.push(-1); // Indicador de "..."
    }
    
    // Determinar o intervalo de páginas ao redor da página atual
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (currentPage < totalPages - 4) {
      pages.push(-1); // Indicador de "..."
    }
    
    // Última página sempre visível (se for diferente da anterior)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }
    
    return pages;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  // Método para iniciar a edição do grupo financeiro
  editarGrupoFinanceiro(rubrica: Rubrica): void {
    if (rubrica.id) {
      this.editandoGrupoFinanceiro[rubrica.id.toString()] = true;
      this.grupoFinanceiroSelecionado[rubrica.id.toString()] = rubrica.grupoFinanceiroId || null;
    }
  }

  // Método chamado quando o grupo financeiro é selecionado no ng-select
  onGrupoFinanceiroChange(rubricaId: number | undefined, event: any): void {
    if (rubricaId) {
      this.grupoFinanceiroSelecionado[rubricaId.toString()] = event?.id || null;
    }
  }

  // Método para salvar a alteração do grupo financeiro
  salvarGrupoFinanceiro(rubrica: Rubrica): void {
    if (!rubrica.id) return;
    
    const rubricaIdStr = rubrica.id.toString();
    const novoGrupoFinanceiroId = this.grupoFinanceiroSelecionado[rubricaIdStr];
    
    // Atualizar a rubrica localmente
    rubrica.grupoFinanceiroId = novoGrupoFinanceiroId || undefined;
    
    // Atualizar o nome do grupo financeiro na exibição
    if (novoGrupoFinanceiroId) {
      const grupo = this.gruposFinanceiros.find((g: any) => g.id === novoGrupoFinanceiroId);
      rubrica.grupoFinanceiroNome = grupo ? grupo.nomeGrupoFinanceiro : undefined;
    } else {
      rubrica.grupoFinanceiroNome = undefined;
    }
    
    // Enviar a atualização para o backend
    this.loading = true;
    this.rubricasService.updateRubrica(rubrica.id, rubrica).subscribe({
      next: (updatedRubrica) => {
        this.loading = false;
        // Atualizar o estado de edição
        this.editandoGrupoFinanceiro[rubricaIdStr] = false;
        console.log('Grupo financeiro atualizado com sucesso:', updatedRubrica);
      },
      error: (error) => {
        console.error('Erro ao atualizar grupo financeiro:', error);
        this.loading = false;
        // Reverter a alteração em caso de erro
        const originalGrupo = this.gruposFinanceiros.find((g: any) => g.id === rubrica.grupoFinanceiroId);
        rubrica.grupoFinanceiroNome = originalGrupo ? originalGrupo.nomeGrupoFinanceiro : undefined;
      }
    });
  }

  // Método para cancelar a edição
  cancelarEdicao(rubrica: Rubrica): void {
    if (rubrica.id) {
      const rubricaIdStr = rubrica.id.toString();
      this.editandoGrupoFinanceiro[rubricaIdStr] = false;
      // Restaurar o valor original
      this.grupoFinanceiroSelecionado[rubricaIdStr] = rubrica.grupoFinanceiroId || null;
    }
  }
}