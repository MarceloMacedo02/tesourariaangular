import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor, Page } from './fornecedor.model';
import { environment } from 'src/environments/environment';

/**
 * Serviço para gerenciamento de Fornecedores
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend
 * e não devem ser manipulados no frontend
 */
@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private apiUrl = `${environment.apiBaseUrl}/api/fornecedores`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista paginada de fornecedores
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getFornecedores(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<Fornecedor>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<Fornecedor>>(this.apiUrl, { params });
  }

  /**
   * Obtém um fornecedor específico pelo ID
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getFornecedorById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo fornecedor
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  createFornecedor(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiUrl, fornecedor);
  }

  /**
   * Atualiza um fornecedor existente
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  updateFornecedor(id: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, fornecedor);
  }

  /**
   * Exclui um fornecedor
   */
  deleteFornecedor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}