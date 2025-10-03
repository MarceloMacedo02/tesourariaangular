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
    this.rubricasService.getRubricas(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response) => {
          this.page = response;
          this.rubricas = response.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar rubricas:', error);
          this.loading = false;
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
}