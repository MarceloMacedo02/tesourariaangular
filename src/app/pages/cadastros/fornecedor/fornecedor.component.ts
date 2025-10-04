import { Component, OnInit } from '@angular/core';
import { Fornecedor, Page } from './fornecedor.model';
import { FornecedorService } from './fornecedor.service';

/**
 * Componente de listagem de Fornecedores
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend 
 * e são exibidos apenas para informação
 */
@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];  // Array de fornecedores retornados pela API
  page: Page<Fornecedor> = {} as Page<Fornecedor>;  // Objeto de paginação
  currentPage = 0;  // Página atual na navegação
  pageSize = 30;  // Número de itens por página
  filtro = '';  // Filtro de busca
  loading = false;  // Indicador de carregamento
  breadCrumbItems!: Array<{}>;  // Itens do breadcrumb

  constructor(
    private fornecedorService: FornecedorService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Fornecedores', active: true }
    ];
    
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.loading = true;
    this.fornecedorService.getFornecedores(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Fornecedor>) => {
          this.page = response;
          this.fornecedores = response.content;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar fornecedores:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.carregarFornecedores();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.carregarFornecedores();
  }

  getStatusText(ativo: boolean | undefined): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  getStatusBadgeClass(ativo: boolean | undefined): string {
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