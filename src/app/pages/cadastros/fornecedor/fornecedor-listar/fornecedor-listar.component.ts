import { Component, OnInit } from '@angular/core';
import { Fornecedor, Page } from '../fornecedor.model';
import { FornecedorService } from '../fornecedor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fornecedor-listar',
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">Listar Fornecedores</h4>
              </div>
              <div class="card-body">
                <div class="live-preview">
                  <div class="table-responsive">
                    <table
                      class="table table-striped table-nowrap align-middle mb-0"
                    >
                      <thead>
                        <tr>
                          <th scope="col">ID</th>
                          <th scope="col">Nome Fantasia</th>
                          <th scope="col">Razão Social</th>
                          <th scope="col">CPF/CNPJ</th>
                          <th scope="col">Telefone</th>
                          <th scope="col">Email</th>
                          <th scope="col">Status</th>
                          <th scope="col">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let fornecedor of fornecedores">
                          <td>{{ fornecedor.id }}</td>
                          <td>{{ fornecedor.nomeFantasia }}</td>
                          <td>{{ fornecedor.razaoSocial }}</td>
                          <td>{{ fornecedor.cpfCnpj }}</td>
                          <td>{{ fornecedor.telefone || 'N/A' }}</td>
                          <td>{{ fornecedor.email || 'N/A' }}</td>
                          <td>
                            <span
                              class="badge"
                              [ngClass]="
                                getStatusBadgeClass(fornecedor.ativo)
                              "
                            >
                              {{ getStatusText(fornecedor.ativo) }}
                            </span>
                          </td>
                          <td>
                            <div class="hstack gap-3 flex-wrap">
                              <button
                                type="button"
                                class="btn btn-sm btn-soft-info edit-item-btn"
                                (click)="editarFornecedor(fornecedor.id || 0)"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                class="btn btn-sm btn-soft-danger remove-item-btn"
                                (click)="excluirFornecedor(fornecedor.id || 0)"
                              >
                                Excluir
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr *ngIf="fornecedores.length === 0">
                          <td colspan="8" class="text-center">
                            Nenhum fornecedor encontrado
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center mt-4"
                >
                  <div>Página {{ currentPage + 1 }} de {{ totalPages }}</div>
                  <div class="d-flex gap-2">
                    <button
                      type="button"
                      class="btn btn-primary"
                      [disabled]="currentPage === 0"
                      (click)="paginaAnterior()"
                    >
                      Anterior
                    </button>
                    <button
                      type="button"
                      class="btn btn-primary"
                      [disabled]="currentPage === totalPages - 1"
                      (click)="proximaPagina()"
                    >
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
export class FornecedorListarComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  page: Page<Fornecedor> = {} as Page<Fornecedor>;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;

  constructor(
    private fornecedorService: FornecedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.fornecedorService.getFornecedores(this.currentPage, this.pageSize).subscribe({
      next: (response: Page<Fornecedor>) => {
        this.page = response;
        this.fornecedores = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
      },
    });
  }

  getStatusText(ativo: boolean | undefined): string {
    return ativo ? 'Ativo' : 'Inativo';
  }

  getStatusBadgeClass(ativo: boolean | undefined): string {
    return ativo ? 'bg-success' : 'bg-danger';
  }

  editarFornecedor(id: number): void {
    this.router.navigate([`/pages/cadastros/fornecedor/editar`, id]);
  }

  excluirFornecedor(id: number): void {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
      this.fornecedorService.deleteFornecedor(id).subscribe({
        next: () => {
          this.carregarFornecedores();
        },
        error: (error) => {
          console.error('Erro ao excluir fornecedor:', error);
          alert('Erro ao excluir fornecedor: ' + error.message);
        }
      });
    }
  }

  paginaAnterior(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.carregarFornecedores();
    }
  }

  proximaPagina(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.carregarFornecedores();
    }
  }
}