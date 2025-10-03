import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrupoFinanceiro, Page } from './grupo-financeiro.model';
import { environment } from 'src/environments/environment';

/**
 * Serviço para gerenciamento de Grupos Financeiros
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend
 * e não devem ser manipulados no frontend
 */
@Injectable({
  providedIn: 'root'
})
export class GrupoFinanceiroService {
  private apiUrl = `${environment.apiBaseUrl}/api/grupos-financeiros`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de grupos financeiros
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getGruposFinanceiros(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<GrupoFinanceiro>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<GrupoFinanceiro>>(this.apiUrl, { params });
  }

  /**
   * Obtém um grupo financeiro específico pelo ID
   * Retorna campos dataRegistro e dataAtualizacao que são de uso exclusivo do backend
   */
  getGrupoFinanceiroById(id: number): Observable<GrupoFinanceiro> {
    return this.http.get<GrupoFinanceiro>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo grupo financeiro
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  createGrupoFinanceiro(grupoFinanceiro: GrupoFinanceiro): Observable<GrupoFinanceiro> {
    return this.http.post<GrupoFinanceiro>(this.apiUrl, grupoFinanceiro);
  }

  /**
   * Atualiza um grupo financeiro existente
   * Campos dataRegistro e dataAtualizacao são gerenciados exclusivamente pelo backend
   */
  updateGrupoFinanceiro(id: number, grupoFinanceiro: GrupoFinanceiro): Observable<GrupoFinanceiro> {
    return this.http.put<GrupoFinanceiro>(`${this.apiUrl}/${id}`, grupoFinanceiro);
  }

  /**
   * Exclui um grupo financeiro
   */
  deleteGrupoFinanceiro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Obtém a lista de centros de custo para uso no formulário
   */
  getCentrosCusto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/centros-custo`);
  }
}