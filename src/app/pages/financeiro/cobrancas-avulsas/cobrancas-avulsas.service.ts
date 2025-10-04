import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Cobranca {
  id?: number;
  socioId?: number;
  socioNome?: string;
  fornecedorId?: number;
  fornecedorNome?: string;
  rubricaId?: number;
  rubricaNome?: string;
  descricao: string;
  valorOriginal: number;
  valorPago?: number;
  dataVencimento: string; // formato YYYY-MM-DD
  dataPagamento?: string | null; // formato YYYY-MM-DD
  status: 'ABERTA' | 'PAGA' | 'CANCELADA';
  tipoCobranca: 'AVULSA' | 'MENSALIDADE';
}

export interface NovaCobrancaAvulsa {
  socioId?: number;
  fornecedorId?: number;
  rubricaId?: number;
  descricao: string;
  valor: number;
  dataVencimento: string; // formato YYYY-MM-DD
  tipoCobranca: 'AVULSA';
}

@Injectable({
  providedIn: 'root'
})
export class CobrancasAvulsasService {

  private apiUrl = `${environment.apiBaseUrl}/cobrancas`;

  constructor(private http: HttpClient) { }

  // Buscar todas as cobranças
  getAll(): Observable<Cobranca[]> {
    return this.http.get<Cobranca[]>(this.apiUrl);
  }

  // Buscar cobrança por ID
  getById(id: number): Observable<Cobranca> {
    return this.http.get<Cobranca>(`${this.apiUrl}/${id}`);
  }

  // Criar nova cobrança avulsa
  createAvulsa(cobranca: NovaCobrancaAvulsa): Observable<Cobranca> {
    return this.http.post<Cobranca>(`${this.apiUrl}/salvar-avulsa`, cobranca);
  }

  // Registrar pagamento de cobrança
  registrarPagamento(id: number, contaFinanceiraId: number): Observable<Cobranca> {
    return this.http.post<Cobranca>(`${this.apiUrl}/registrar-pagamento/${id}?contaFinanceiraId=${contaFinanceiraId}`, {});
  }

  // Atualizar cobrança existente
  update(id: number, cobranca: Partial<NovaCobrancaAvulsa>): Observable<Cobranca> {
    return this.http.put<Cobranca>(`${this.apiUrl}/${id}`, cobranca);
  }

  // Excluir cobrança
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}