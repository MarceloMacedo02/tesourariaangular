import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Transacao, TransacaoFilterParams } from '../models/transacao.model';

@Injectable({
  providedIn: 'root'
})
export class TransacoesService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Busca transações por mês e ano específicos
   */
  getTransacoesPorMesAno(params: TransacaoFilterParams): Observable<Transacao[]> {
    const url = `${this.baseUrl}/api/transacoes/por-mes-ano`;
    const queryParams = `?ano=${params.ano}&mes=${params.mes}`;
    return this.http.get<Transacao[]>(`${url}${queryParams}`);
  }

  /**
   * Busca transações por mês e ano com paginação (opcional)
   */
  getTransacoesPorMesAnoComPaginacao(
    params: TransacaoFilterParams,
    page?: number,
    size?: number
  ): Observable<Transacao[]> {
    const url = `${this.baseUrl}/api/transacoes/por-mes-ano`;
    let queryParams = `?ano=${params.ano}&mes=${params.mes}`;
    
    if (page !== undefined) {
      queryParams += `&page=${page}`;
    }
    
    if (size !== undefined) {
      queryParams += `&size=${size}`;
    }
    
    return this.http.get<Transacao[]>(`${url}${queryParams}`);
  }

  /**
   * Atualiza o status de lançamento de uma transação (para quitação)
   */
  quitarTransacao(id: number): Observable<Transacao> {
    // Assumindo que o endpoint para quitar uma transação altera o status para LANCADO
    const url = `${this.baseUrl}/api/transacoes/${id}/quitar`;
    return this.http.post<Transacao>(url, {});
  }

  /**
   * Atualiza os dados de uma transação
   */
  /**
   * Busca transações de crédito por mês e ano específicos
   */
  getTransacoesCreditoPorMesAno(params: TransacaoFilterParams): Observable<Transacao[]> {
    const url = `${this.baseUrl}/api/transacoes/por-mes-ano-credito`;
    const queryParams = `?ano=${params.ano}&mes=${params.mes}`;
    return this.http.get<Transacao[]>(`${url}${queryParams}`);
  }

  updateTransacao(id: number, transacao: Partial<Transacao>): Observable<Transacao> {
    const url = `${this.baseUrl}/api/transacoes/${id}`;
    return this.http.put<Transacao>(url, transacao);
  }

  /**
   * Busca uma transação específica por ID
   */
  getTransacaoById(id: number): Observable<Transacao> {
    const url = `${this.baseUrl}/api/transacoes/${id}`;
    return this.http.get<Transacao>(url);
  }
}