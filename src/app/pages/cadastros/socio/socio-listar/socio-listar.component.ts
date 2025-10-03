import { Component, OnInit } from '@angular/core';
import { Socio, Page } from '../socio.model';
import { SocioService } from '../socio.service';

@Component({
  selector: 'app-socio-listar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Listar Sócios</h4>
              </div>
              <div class="card-body">
                <div class="live-preview">
                  <div class="table-responsive">
                    <table class="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Nome</th>
                          <th scope="col">CPF</th>
                          <th scope="col">Grau</th>
                          <th scope="col">Status</th>
                          <th scope="col">Email</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let socio of socios">
                          <td>{{ socio.id }}</td>
                          <td>{{ socio.nomeSocio }}</td>
                          <td>{{ socio.cpf }}</td>
                          <td>{{ socio.grau }}</td>
                          <td>
                            <span class="badge" [ngClass]="getStatusBadgeClass(socio.status || '')">
                              {{ getStatusText(socio.status || '') }}
                            </span>
                          </td>
                          <td>{{ socio.email || 'N/A' }}</td>
                          <td>
                            <div class="hstack gap-3 flex-wrap">
                              <button type="button" class="btn btn-sm btn-soft-info edit-item-btn" 
                                (click)="editarSocio(socio.id || 0)">
                                Editar
                              </button>
                              <button type="button" class="btn btn-sm btn-soft-danger remove-item-btn"
                                (click)="excluirSocio(socio.id || 0)">
                                Excluir
                              </button>
                              <a [routerLink]="['/pages/cobrancas/socio', socio.id]" class="btn btn-sm btn-soft-primary" title="Visualizar Cobranças">
                                <i class="ri-file-list-fill align-bottom"></i> Cobranças
                              </a>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="socios.length === 0">
                          <td colspan="7" class="text-center">Nenhum sócio encontrado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center mt-4">
                  <div>
                    Página {{ currentPage + 1 }} de {{ totalPages }}
                  </div>
                  <div class="d-flex gap-2">
                    <button type="button" class="btn btn-primary" [disabled]="currentPage === 0" (click)="paginaAnterior()">
                      Anterior
                    </button>
                    <button type="button" class="btn btn-primary" [disabled]="currentPage === totalPages - 1" (click)="proximaPagina()">
                      Próxima
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SocioListarComponent implements OnInit {
  socios: Socio[] = [];
  page: Page<Socio> = {} as Page<Socio>;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;

  constructor(private socioService: SocioService) { }

  ngOnInit(): void {
    this.carregarSocios();
  }

  carregarSocios(): void {
    this.socioService.getSocios(this.currentPage, this.pageSize).subscribe({
      next: (response: Page<Socio>) => {
        this.page = response;
        this.socios = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar sócios:', error);
      }
    });
  }

  getStatusText(status: string): string {
    return status || 'Desconhecido';
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'ativo':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  }

  editarSocio(id: number): void {
    // Navegar para a página de edição de sócio
    window.location.href = `/pages/cadastros/socio/editar/${id}`;
  }

  excluirSocio(id: number): void {
    if (confirm('Tem certeza que deseja excluir este sócio?')) {
      this.socioService.deleteSocio(id).subscribe({
        next: () => {
          // Recarregar a lista após exclusão
          this.carregarSocios();
        },
        error: (error) => {
          console.error('Erro ao excluir sócio:', error);
        }
      });
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarSocios();
    }
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarSocios();
    }
  }
}