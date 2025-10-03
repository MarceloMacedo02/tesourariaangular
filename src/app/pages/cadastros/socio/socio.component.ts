import { Component, OnInit } from '@angular/core';
import { Socio, Page, SocioDependente } from './socio.model';
import { SocioService } from './socio.service';

/**
 * Componente de listagem de Sócios
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend 
 * e são exibidos apenas para informação
 */
@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.scss']
})
export class SocioComponent implements OnInit {
  socios: Socio[] = [];  // Array de sócios retornados pela API
  page: Page<Socio> = {} as Page<Socio>;  // Objeto de paginação
  currentPage = 0;  // Página atual na navegação
  pageSize = 30;  // Número de itens por página
  filtro = '';  // Filtro de busca
  loading = false;  // Indicador de carregamento
  breadCrumbItems!: Array<{}>;  // Itens do breadcrumb

  constructor(private socioService: SocioService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Sócios', active: true }
    ];
    
    this.loadSocios();
  }

  loadSocios(): void {
    this.loading = true;
    this.socioService.getSocios(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Socio>) => {
          this.page = response;
          this.socios = response.content;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar sócios:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadSocios();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadSocios();
  }

  getStatusText(status: string): string {
    return status || 'Desconhecido';
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase();
    switch(statusLower) {
      case 'ativo':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getGrauSocioText(grau: string): string {
    return grau || 'Desconhecido';
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