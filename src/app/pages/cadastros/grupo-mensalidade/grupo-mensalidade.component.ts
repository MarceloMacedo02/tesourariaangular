import { Component, OnInit } from '@angular/core';
import { GrupoMensalidade, Page } from './grupo-mensalidade.model';
import { GrupoMensalidadeService } from './grupo-mensalidade.service';

/**
 * Componente de listagem de Grupos de Mensalidade
 * Campos dataRegistro, dataAtualizacao e dataCriacao são de uso exclusivo do backend 
 * e são exibidos apenas para informação
 */
@Component({
  selector: 'app-grupo-mensalidade',
  templateUrl: './grupo-mensalidade.component.html',
  styleUrls: ['./grupo-mensalidade.component.scss']
})
export class GrupoMensalidadeComponent implements OnInit {
  gruposMensalidade: GrupoMensalidade[] = [];  // Array de grupos de mensalidade retornados pela API
  page: Page<GrupoMensalidade> = {} as Page<GrupoMensalidade>;  // Objeto de paginação
  currentPage = 0;  // Página atual na navegação
  pageSize = 30;  // Número de itens por página
  filtro = '';  // Filtro de busca
  loading = false;  // Indicador de carregamento
  breadCrumbItems!: Array<{}>;  // Itens do breadcrumb

  constructor(private grupoMensalidadeService: GrupoMensalidadeService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Grupos de Mensalidade', active: true }
    ];
    
    this.loadGruposMensalidade();
  }

  loadGruposMensalidade(): void {
    this.loading = true;
    this.grupoMensalidadeService.getGruposMensalidade(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response) => {
          this.page = response;
          // Calcular o valor total para cada grupo de mensalidade
          this.gruposMensalidade = response.content.map(grupo => {
            const valorTotal = this.calcularValorTotal(grupo);
            return {
              ...grupo,
              valorTotal: valorTotal
            };
          });
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar grupos de mensalidade:', error);
          this.loading = false;
        }
      });
  }

  calcularValorTotal(grupo: GrupoMensalidade): number {
    if (!grupo.itensRubricaMensalidade || grupo.itensRubricaMensalidade.length === 0) {
      return 0;
    }
    
    return grupo.itensRubricaMensalidade.reduce((total, item) => {
      return total + (item.valor || 0);
    }, 0);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadGruposMensalidade();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadGruposMensalidade();
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
}