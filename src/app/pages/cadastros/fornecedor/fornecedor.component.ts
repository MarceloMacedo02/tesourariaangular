import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fornecedor, FornecedorPage } from './fornecedor.model';
import { FornecedorService } from './fornecedor.service';
import { ConfirmDialogComponent, ConfirmDialogData } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss']
})
export class FornecedorComponent implements OnInit {
  fornecedores: Fornecedor[] = [];
  fornecedorSelecionado: Fornecedor | null = null;
  modoEdicao: boolean = false;
  filtro: string = '';
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  loading: boolean = false;

  constructor(
    private fornecedorService: FornecedorService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(page: number = 0, size: number = 10, filtro: string = ''): void {
    this.loading = true;
    this.fornecedorService.listarFornecedores(page, size, filtro).subscribe({
      next: (response: FornecedorPage) => {
        this.fornecedores = response.content;
        this.totalElements = response.totalElements;
        this.currentPage = response.number;
        this.pageSize = response.size;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar fornecedores:', error);
        this.loading = false;
      }
    });
  }

  onSalvarFornecedor(fornecedor: Fornecedor): void {
    if (fornecedor.id) {
      // Atualizar fornecedor existente
      this.fornecedorService.atualizarFornecedor(fornecedor.id, fornecedor).subscribe({
        next: (response: Fornecedor) => {
          // Atualizar a lista localmente
          const index = this.fornecedores.findIndex(f => f.id === response.id);
          if (index !== -1) {
            this.fornecedores[index] = response;
          }
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao atualizar fornecedor:', error);
        }
      });
    } else {
      // Criar novo fornecedor
      this.fornecedorService.criarFornecedor(fornecedor).subscribe({
        next: (response: Fornecedor) => {
          // Adicionar novo fornecedor à lista
          this.fornecedores.unshift(response);
          this.resetForm();
        },
        error: (error) => {
          console.error('Erro ao criar fornecedor:', error);
        }
      });
    }
  }

  onEditarFornecedor(fornecedor: Fornecedor): void {
    this.fornecedorSelecionado = { ...fornecedor }; // Fazer cópia para evitar alterações indesejadas
    this.modoEdicao = true;
  }

  onExcluirFornecedor(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { 
        title: 'Confirmar Exclusão', 
        message: 'Tem certeza que deseja excluir este fornecedor? Esta ação não pode ser desfeita.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fornecedorService.excluirFornecedor(id).subscribe({
          next: () => {
            // Remover da lista localmente
            this.fornecedores = this.fornecedores.filter(f => f.id !== id);
          },
          error: (error) => {
            console.error('Erro ao excluir fornecedor:', error);
          }
        });
      }
    });
  }

  onAdicionarNovo(): void {
    this.resetForm();
  }

  onCancelForm(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.fornecedorSelecionado = null;
    this.modoEdicao = false;
  }

  onPageChange(pageIndex: number, pageSize: number): void {
    this.carregarFornecedores(pageIndex, pageSize, this.filtro);
  }

  onFilterChange(filtro: string): void {
    this.filtro = filtro;
    this.carregarFornecedores(0, this.pageSize, this.filtro); // Reiniciar para a primeira página ao filtrar
  }
}