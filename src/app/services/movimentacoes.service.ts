import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Movimentacao, MovimentacaoRequest, SocioSimples, CobrancaSocio } from '../models/movimentacao.model';

@Injectable({
  providedIn: 'root'
})
export class MovimentacoesService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  /**
   * Registra uma nova movimentação financeira
   */
  registrarMovimentacao(movimentacao: MovimentacaoRequest): Observable<Movimentacao> {
    const url = `${this.baseUrl}/api/movimentacoes`;
    return this.http.post<Movimentacao>(url, movimentacao);
  }

  /**
   * Atualiza uma movimentação existente
   */
  atualizarMovimentacao(id: number, movimentacao: MovimentacaoRequest): Observable<Movimentacao> {
    const url = `${this.baseUrl}/api/movimentacoes/${id}`;
    return this.http.put<Movimentacao>(url, movimentacao);
  }

  /**
   * Busca uma movimentação específica por ID
   */
  getMovimentacaoById(id: number): Observable<Movimentacao> {
    const url = `${this.baseUrl}/api/movimentacoes/${id}`;
    return this.http.get<Movimentacao>(url);
  }

  /**
   * Lista sócios com ID e nome (para o ng-select)
   */
  getSociosSimples(): Observable<SocioSimples[]> {
    const url = `${this.baseUrl}/api/simples/socios`;
    return this.http.get<SocioSimples[]>(url);
  }

  /**
   * Busca as cobranças mensais de um sócio específico
   */
  getCobrancasMensaisDoSocio(socioId: number): Observable<CobrancaSocio[]> {
    const url = `${this.baseUrl}/api/cobrancas/socio/${socioId}/tipo/mensalidade`;
    return this.http.get<CobrancaSocio[]>(url);
  }

  /**
   * Busca as cobranças de rubricas de um sócio específico (não mensalidade)
   */
  getCobrancasRubricasDoSocio(socioId: number): Observable<CobrancaSocio[]> {
    const url = `${this.baseUrl}/api/cobrancas/socio/${socioId}/tipo/rubrica`;
    return this.http.get<CobrancaSocio[]>(url);
  }

  /**
   * Cria uma nova cobrança de rubrica
   */
  criarCobrancaRubrica(cobranca: any): Observable<any> {
    const url = `${this.baseUrl}/api/cobrancas/rubrica`;
    return this.http.post<any>(url, cobranca);
  }
}