import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ContaPagar {
  id?: number;
  fornecedorId: number;
  fornecedorNome: string;
  rubricaId: number;
  rubricaNome: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // formato YYYY-MM-DD
  dataPagamento?: string | null; // formato YYYY-MM-DD
  status: 'ABERTA' | 'PAGA' | 'CANCELADA';
}

export interface NovaContaPagar {
  fornecedorId: number;
  rubricaId: number;
  descricao: string;
  valor: number;
  dataVencimento: string; // formato YYYY-MM-DD
}

@Injectable({
  providedIn: 'root'
})
export class ContasPagarService {

  private apiUrl = `${environment.apiBaseUrl}/contas-a-pagar`;

  constructor(private http: HttpClient) { }

  // Buscar todas as contas a pagar
  getAll(): Observable<ContaPagar[]> {
    return this.http.get<ContaPagar[]>(this.apiUrl);
  }

  // Buscar conta a pagar por ID
  getById(id: number): Observable<ContaPagar> {
    return this.http.get<ContaPagar>(`${this.apiUrl}/${id}`);
  }

  // Criar nova conta a pagar
  create(contaPagar: NovaContaPagar): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(`${this.apiUrl}/salvar`, contaPagar);
  }

  // Atualizar conta a pagar existente
  update(id: number, contaPagar: Partial<NovaContaPagar>): Observable<ContaPagar> {
    return this.http.put<ContaPagar>(`${this.apiUrl}/${id}`, contaPagar);
  }

  // Registrar pagamento de conta a pagar
  registrarPagamento(id: number, contaFinanceiraId: number): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(`${this.apiUrl}/registrar-pagamento/${id}?contaFinanceiraId=${contaFinanceiraId}`, {});
  }

  // Excluir conta a pagar
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}