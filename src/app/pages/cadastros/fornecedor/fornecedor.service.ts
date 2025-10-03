import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor, FornecedorPage } from './fornecedor.model';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = '/api/fornecedores';

  constructor(private http: HttpClient) { }

  // Listar fornecedores com paginação e filtro
  listarFornecedores(page: number = 0, size: number = 10, filtro: string = ''): Observable<FornecedorPage> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtro) {
      params = params.set('filtro', filtro);
    }

    return this.http.get<FornecedorPage>(`${this.apiUrl}`, { params });
  }

  // Buscar fornecedor por ID
  buscarFornecedorPorId(id: number): Observable<Fornecedor> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID do fornecedor é obrigatório e deve ser um número positivo');
    }

    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
  }

  // Criar novo fornecedor
  criarFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    // Validações frontend
    if (!fornecedor.nomeFantasia) {
      throw new Error('Nome fantasia é obrigatório');
    }

    if (!fornecedor.cpfCnpj) {
      throw new Error('CPF/CNPJ é obrigatório');
    }

    return this.http.post<Fornecedor>(`${this.apiUrl}`, fornecedor);
  }

  // Atualizar fornecedor existente
  atualizarFornecedor(id: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID do fornecedor é obrigatório e deve ser um número positivo');
    }

    if (!fornecedor.nomeFantasia) {
      throw new Error('Nome fantasia é obrigatório');
    }

    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, fornecedor);
  }

  // Excluir fornecedor
  excluirFornecedor(id: number): Observable<void> {
    if (!id || typeof id !== 'number' || id <= 0) {
      throw new Error('ID do fornecedor é obrigatório e deve ser um número positivo');
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}