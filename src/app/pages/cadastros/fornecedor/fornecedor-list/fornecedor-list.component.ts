import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Fornecedor } from '../fornecedor.model';

@Component({
  selector: 'app-fornecedor-list',
  templateUrl: './fornecedor-list.component.html',
  styleUrls: ['./fornecedor-list.component.scss']
})
export class FornecedorListComponent implements OnInit {
  @Output() edit = new EventEmitter<Fornecedor>();
  @Output() delete = new EventEmitter<number>();
  @Output() addNew = new EventEmitter<void>();

  displayedColumns: string[] = ['id', 'nomeFantasia', 'razaoSocial', 'cpfCnpj', 'telefone', 'email', 'ativo', 'actions'];
  dataSource = new MatTableDataSource<Fornecedor>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    // Inicialização do componente
  }

  ngOnChanges(): void {
    this.dataSource.data = this.fornecedores;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @Input() fornecedores: Fornecedor[] = [];
  @Input() totalElements: number = 0;
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onEdit(fornecedor: Fornecedor): void {
    this.edit.emit(fornecedor);
  }

  onDelete(id: number): void {
    this.delete.emit(id);
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  onPageChange(pageIndex: number, pageSize: number): void {
    // Emitir evento para que o componente pai gerencie a paginação
    // Esta funcionalidade será implementada no componente pai
  }
}