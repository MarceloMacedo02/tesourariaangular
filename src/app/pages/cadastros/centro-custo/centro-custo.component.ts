import { Component, OnInit } from '@angular/core';
import { CentroCusto, Page } from './centro-custo.model';
import { CentroCustoService } from './centro-custo.service';

@Component({
  selector: 'app-centro-custo',
  templateUrl: './centro-custo.component.html',
  styleUrls: ['./centro-custo.component.scss']
})
export class CentroCustoComponent implements OnInit {
  centrosCusto: CentroCusto[] = [];
  page: Page<CentroCusto> = {} as Page<CentroCusto>;
  currentPage = 0;
  pageSize = 30;
  filtro = '';
  loading = false;
  breadCrumbItems!: Array<{}>;

  constructor(private centroCustoService: CentroCustoService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Centro de Custo', active: true }
    ];
    
    this.loadCentrosCusto();
  }

  loadCentrosCusto(): void {
    this.loading = true;
    this.centroCustoService.getCentrosCusto(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response) => {
          this.page = response;
          this.centrosCusto = response.content;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar centros de custo:', error);
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadCentrosCusto();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadCentrosCusto();
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
  getSaldo(centroCusto: CentroCusto): number {
    const credito = centroCusto.saldoCredito || 0;
    const despesa = centroCusto.saldoDespesa || 0;
    return credito - despesa;
  }
}