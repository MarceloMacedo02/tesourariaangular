import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { 
  TransacaoProcessingResult, 
  TransacaoPendente, 
  TransacaoDto,
  ReferenciasFinanceiras
} from '../models/transacao-ofx.model';
import { Fornecedor, Rubrica, Socio, ReferenciasFinanceirasService } from '../services/referencias-financeiras.service';

@Injectable({
  providedIn: 'root'
})
export class TransacoesOfxService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(
    private http: HttpClient,
    private referenciasService: ReferenciasFinanceirasService
  ) {}

  /**
   * Importa um arquivo OFX e processa as transações
   */
  importarOFX(formData: FormData): Observable<TransacaoProcessingResult> {
    return this.http.post<TransacaoProcessingResult>(
      `${this.baseUrl}/api/transacoes/importar-ofx`,
      formData
    );
  }

  /**
   * Associa uma transação pendente a um sócio ou fornecedor
   */
  associarPendente(
    transacaoPendenteId: number, 
    relacionadoId: number, 
    tipoRelacionamento: 'SOCIO' | 'FORNECEDOR'
  ): Observable<TransacaoDto> {
    const url = `${this.baseUrl}/api/transacoes/associar-pendente/${transacaoPendenteId}`;
    const params = `?relacionadoId=${relacionadoId}&tipoRelacionamento=${tipoRelacionamento}`;
    return this.http.post<TransacaoDto>(`${url}${params}`, {});
  }

  /**
   * Descarta uma transação pendente
   */
  descartarPendente(transacaoPendenteId: number): Observable<void> {
    const url = `${this.baseUrl}/api/transacoes/descartar-pendente/${transacaoPendenteId}`;
    return this.http.post<void>(url, {});
  }

  /**
   * Lista transações pendentes
   */
  listarPendentes(): Observable<TransacaoPendente[]> {
    return this.http.get<TransacaoPendente[]>(`${this.baseUrl}/api/transacoes/pendentes`);
  }

  /**
   * Remove transações associadas a um arquivo específico
   */
  removerPorArquivo(nomeArquivo: string): Observable<void> {
    const url = `${this.baseUrl}/api/transacoes/remover-por-arquivo`;
    const params = `?nomeArquivo=${encodeURIComponent(nomeArquivo)}`;
    return this.http.delete<void>(`${url}${params}`);
  }

  /**
   * Obtém referências financeiras (sócios, fornecedores, rubricas)
   */
  getReferenciasFinanceiras(): Observable<ReferenciasFinanceiras> {
    return new Observable(observer => {
      // Faz as três chamadas simultaneamente
      let socios: Socio[] = [];
      let fornecedores: Fornecedor[] = [];
      let rubricas: Rubrica[] = [];
      let completed = 0;

      // Obtém sócios
      this.referenciasService.getSocios().subscribe({
        next: (data) => {
          socios = data;
          completed++;
          if (completed === 3) {
            observer.next({
              socios,
              fornecedores,
              rubricas
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });

      // Obtém fornecedores
      this.referenciasService.getFornecedores().subscribe({
        next: (data) => {
          fornecedores = data;
          completed++;
          if (completed === 3) {
            observer.next({
              socios,
              fornecedores,
              rubricas
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });

      // Obtém rubricas
      this.referenciasService.getRubricas().subscribe({
        next: (data) => {
          rubricas = data;
          completed++;
          if (completed === 3) {
            observer.next({
              socios,
              fornecedores,
              rubricas
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
}