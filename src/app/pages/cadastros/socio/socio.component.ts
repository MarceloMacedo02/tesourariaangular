import { Component, OnInit } from '@angular/core';
import { Socio, Page, SocioDependente, GrupoMensalidade } from './socio.model';
import { SocioService } from './socio.service';
import { GrupoMensalidadeService } from '../grupo-mensalidade/grupo-mensalidade.service';

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
  gruposMensalidade: GrupoMensalidade[] = [];  // Array de grupos de mensalidade
  page: Page<Socio> = {} as Page<Socio>;  // Objeto de paginação
  currentPage = 0;  // Página atual na navegação
  pageSize = 30;  // Número de itens por página
  filtro = '';  // Filtro de busca
  loading = false;  // Indicador de carregamento
  loadingGruposMensalidade = false;  // Indicador de carregamento dos grupos
  breadCrumbItems!: Array<{}>;  // Itens do breadcrumb
  editandoGrupoMensalidade: { [key: string]: boolean } = {}; // Controle de edição inline

  constructor(
    private socioService: SocioService,
    private grupoMensalidadeService: GrupoMensalidadeService
  ) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Cadastros' },
      { label: 'Sócios', active: true }
    ];
    
    this.loadGruposMensalidade();
    this.loadSocios();
  }

  loadGruposMensalidade(): void {
    this.loadingGruposMensalidade = true;
    this.grupoMensalidadeService.getAllGruposMensalidade().subscribe({
      next: (data: GrupoMensalidade[]) => {
        this.gruposMensalidade = data;
        this.loadingGruposMensalidade = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar grupos de mensalidade:', error);
        this.loadingGruposMensalidade = false;
      }
    });
  }

  loadSocios(): void {
    this.loading = true;
    this.socioService.getSocios(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Socio>) => {
          this.page = response;
          this.socios = response.content;
          
          // Inicializar os estados de edição
          this.editandoGrupoMensalidade = {};
          this.socios.forEach(socio => {
            if (socio.id) {
              this.editandoGrupoMensalidade[socio.id.toString()] = false;
            }
          });
          
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
      case 'afastado':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  }

  getGrauSocioText(grau: string): string {
    return grau || 'Desconhecido';
  }

  getGrupoMensalidadeNome(grupoMensalidadeId: number | undefined): string {
    if (!grupoMensalidadeId) {
      return '-';
    }
    const grupo = this.gruposMensalidade.find(g => g.id === grupoMensalidadeId);
    return grupo ? grupo.nomeGrupoMensalidade : 'Grupo não encontrado';
  }

  // Método para iniciar a edição do grupo mensalidade
  editarGrupoMensalidade(socio: Socio): void {
    if (socio.id) {
      this.editandoGrupoMensalidade[socio.id.toString()] = true;
    }
  }

  // Método para salvar a alteração do grupo mensalidade
  salvarGrupoMensalidade(socio: Socio): void {
    if (!socio.id) return;
    
    const socioIdStr = socio.id.toString();
    
    // Enviar a atualização para o backend
    this.loading = true;
    this.socioService.updateSocio(socio.id, socio).subscribe({
      next: (updatedSocio) => {
        this.loading = false;
        // Atualizar o estado de edição
        this.editandoGrupoMensalidade[socioIdStr] = false;
        console.log('Grupo mensalidade atualizado com sucesso:', updatedSocio);
      },
      error: (error) => {
        console.error('Erro ao atualizar grupo mensalidade:', error);
        this.loading = false;
        // Reverter a alteração em caso de erro (atualizar a lista para garantir consistência)
        this.loadSocios();
      }
    });
  }

  // Método para cancelar a edição
  cancelarEdicao(socio: Socio): void {
    if (socio.id) {
      const socioIdStr = socio.id.toString();
      this.editandoGrupoMensalidade[socioIdStr] = false;
      // Recarregar o sócio para reverter quaisquer alterações não salvas
      this.socioService.getSocioById(socio.id).subscribe({
        next: (socioAtualizado) => {
          const index = this.socios.findIndex(s => s.id === socio.id);
          if (index !== -1) {
            this.socios[index] = socioAtualizado;
          }
        },
        error: (error) => {
          console.error('Erro ao recarregar sócio:', error);
        }
      });
    }
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