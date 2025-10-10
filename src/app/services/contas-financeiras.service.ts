import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ContaFinanceira } from '../models/conta-financeira.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContasFinanceirasService {
  private apiUrl = `${environment.apiBaseUrl}/api/contas-financeiras`;

  constructor(private http: HttpClient) {}

  getAllContas(): Observable<ContaFinanceira[]> {
    // Actual implementation for the endpoint /api/contas-financeiras
    // For now, returning mock data
    const mockContas: ContaFinanceira[] = [
      { id: 1, nome: 'Conta Corrente Banco X', descricao: 'Conta principal' },
      { id: 2, nome: 'Conta Poupança', descricao: 'Poupança mensal' },
      { id: 3, nome: 'Caixa', descricao: 'Dinheiro físico' }
    ];
    return of(mockContas);
    // Actual implementation would be:
    // return this.http.get<ContaFinanceira[]>(this.apiUrl);
  }

  getContaById(id: number): Observable<ContaFinanceira> {
    return this.http.get<ContaFinanceira>(`${this.apiUrl}/${id}`);
  }
}