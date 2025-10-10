import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cobranca, BatchBillingRequest, BatchBillingResponse } from './non-monthly-billing.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NonMonthlyBillingService {
  private apiUrl = `${environment.apiBaseUrl}/api/cobrancas`;

  constructor(private http: HttpClient) { }

  // Create individual non-monthly billing for a single socio
  createNonMonthlyBilling(billing: Cobranca): Observable<Cobranca> {
    return this.http.post<Cobranca>(`${this.apiUrl}/nao-mensalidade`, billing);
  }

  // Create batch non-monthly billings for multiple socios
  createBatchNonMonthlyBillings(billings: Cobranca[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/nao-mensalidade/lote`, billings);
  }

  // Get all non-monthly billings
  getNonMonthlyBillings(): Observable<Cobranca[]> {
    return this.http.get<Cobranca[]>(`${this.apiUrl}/nao-mensalidade`);
  }

  // Get non-monthly billing by ID
  getNonMonthlyBillingById(id: number): Observable<Cobranca> {
    return this.http.get<Cobranca>(`${this.apiUrl}/nao-mensalidade/${id}`);
  }

  // Get all billings for a specific socio
  getBillingsBySocioId(socioId: number): Observable<Cobranca[]> {
    return this.http.get<Cobranca[]>(`${this.apiUrl}/socio/${socioId}`);
  }

  // Get billings for a specific socio by status
  getBillingsBySocioIdAndStatus(socioId: number, status: string): Observable<Cobranca[]> {
    return this.http.get<Cobranca[]>(`${this.apiUrl}/socio/${socioId}/${status.toLowerCase() === 'pago' ? 'quitadas' : 'abertas'}`);
  }

  // Update non-monthly billing
  updateNonMonthlyBilling(id: number, billing: Cobranca): Observable<Cobranca> {
    return this.http.put<Cobranca>(`${this.apiUrl}/nao-mensalidade/${id}`, billing);
  }

  // Delete billing by ID (general endpoint)
  deleteCobranca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Delete non-monthly billing (legacy method)
  deleteNonMonthlyBilling(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/nao-mensalidade/${id}`);
  }

  // Create individual billing for OUTRAS_RUBRICAS
  createOutrasRubricasBilling(socioId: number, rubricaId: number, valor: number, dataVencimento: string, descricao?: string): Observable<Cobranca> {
    const params = new URLSearchParams({
      socioId: socioId.toString(),
      rubricaId: rubricaId.toString(),
      valor: valor.toString(),
      dataVencimento: dataVencimento
    });
    
    if (descricao) {
      params.append('descricao', descricao);
    }

    return this.http.post<Cobranca>(`${this.apiUrl}/salvar-outras-rubricas-individual?${params.toString()}`, {});
  }

  // Create batch billing for OUTRAS_RUBRICAS
  createBatchOutrasRubricasBillings(request: BatchBillingRequest): Observable<BatchBillingResponse> {
    return this.http.post<BatchBillingResponse>(`${this.apiUrl}/salvar-outras-rubricas`, request);
  }
}