import { Component, OnInit } from '@angular/core';
import { GrupoFinanceiro, Page } from './grupo-financeiro.model';
import { GrupoFinanceiroService } from './grupo-financeiro.service';

@Component({
  selector: 'app-grupo-financeiro',
  templateUrl: './grupo-financeiro.component.html',
  styleUrls: ['./grupo-financeiro.component.scss']
})
export class GrupoFinanceiroComponent implements OnInit {
  gruposFinanceiros: GrupoFinanceiro[] = [];
  page: Page<GrupoFinanceiro> = {} as Page<GrupoFinanceiro>;
  currentPage = 0;
  pageSize = 30;
  filtro = '';
  loading = false;
  breadCrumbItems!: Array<{}>;

  constructor(private grupoFinanceiroService: GrupoFinanceiroService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Grupo Financeiro', active: true }
    ];
    
    this.loadGruposFinanceiros();
  }

  loadGruposFinanceiros(): void {
    this.loading = true;
    this.grupoFinanceiroService.getGruposFinanceiros(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response) => {
          this.page = response;
          this.gruposFinanceiros = response.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar grupos financeiros:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadGruposFinanceiros();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadGruposFinanceiros();
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

  // Calculated property: Saldo = creditos - saidas
  getSaldo(grupoFinanceiro: GrupoFinanceiro): number {
    // Placeholder - depends on actual implementation, maybe related to centro de custo
    return 0; // This would need to be implemented based on business logic
  }
}