import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CobrancaDTO } from '../models/cobranca-dto.model';

@Injectable({
  providedIn: 'root',
})
export class CobrancasService {
  private apiUrl = 'api/cobrancas';

  constructor(private http: HttpClient) {}

  // CRUD completo
  criarCobranca(cobranca: CobrancaDTO): Observable<CobrancaDTO> {
    return this.http.post<CobrancaDTO>(`${this.apiUrl}`, cobranca);
  }

  getCobrancaPorId(id: number): Observable<CobrancaDTO> {
    return this.http.get<CobrancaDTO>(`${this.apiUrl}/${id}`);
  }

  atualizarCobranca(
    id: number,
    cobranca: CobrancaDTO
  ): Observable<CobrancaDTO> {
    return this.http.put<CobrancaDTO>(`${this.apiUrl}/${id}`, cobranca);
  }

  excluirCobranca(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Endpoints de filtragem
  getCobrancasPorTipo(
    tipoCobranca: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/tipo/${tipoCobranca}?page=${page}&size=${size}`
    );
  }

  getCobrancasPorSocio(
    socioId: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/socio/${socioId}?page=${page}&size=${size}`
    );
  }

  getCobrancasPorFornecedor(
    fornecedorId: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/fornecedor/${fornecedorId}?page=${page}&size=${size}`
    );
  }

  getCobrancasPorRubrica(
    rubricaId: number,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/rubrica/${rubricaId}?page=${page}&size=${size}`
    );
  }

  getCobrancasPorDataVencimento(
    data: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/data-vencimento?data=${data}&page=${page}&size=${size}`
    );
  }

  getCobrancasPorPeriodoVencimento(
    inicio: string,
    fim: string,
    page: number = 0,
    size: number = 10
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/periodo-vencimento?inicio=${inicio}&fim=${fim}&page=${page}&size=${size}`
    );
  }

  // Listar todas com paginação
  getAllCobrancas(page: number = 0, size: number = 10): Observable<any> {
    return this.http.get(`${this.apiUrl}?page=${page}&size=${size}`);
  }
}
