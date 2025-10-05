import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { 
  TransacaoProcessingResult, 
  TransacaoPendente, 
  TransacaoDto,
  ReferenciasFinanceiras,
  OfxUploadRequest,
  OfxUploadResponse,
  OfxTransaction,
  ApiErrorResponse
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
   * Importa um arquivo OFX e processa as transações (nova implementação conforme especificação)
   */
  importarOFX(formData: FormData, accountId?: number): Observable<TransacaoProcessingResult> {
    // Criar novo FormData com o arquivo e o accountId se fornecido
    const requestFormData = new FormData();
    const file = formData.get('file') as File;
    requestFormData.append('file', file);
    
    if (accountId !== undefined) {
      requestFormData.append('accountId', accountId.toString());
    }

    return this.http.post<OfxUploadResponse>(
      `${this.baseUrl}/api/contas/upload-ofx`,
      requestFormData
    ).pipe(
      // Converter nova estrutura para estrutura antiga para manter compatibilidade
      map(response => this.transformOfxResponseToLegacy(response))
    );
  }

  /**
   * Método auxiliar para converter a nova resposta para o formato antigo
   */
  private transformOfxResponseToLegacy(response: OfxUploadResponse): TransacaoProcessingResult {
    const creditTransacoes: TransacaoDto[] = [];
    const debitTransacoes: TransacaoDto[] = [];
    const transacoesPendentes: TransacaoPendente[] = [];

    // Converter transações da nova estrutura para a antiga
    response.data.transactions.forEach((ofxTransacao, index) => {
      // Criar objeto compatível com TransacaoDto
      const transacaoDto: TransacaoDto = {
        id: index + 1, // Gerar ID baseado no índice (será substituído pelo backend)
        data: ofxTransacao.date,
        tipo: ofxTransacao.type === 'credit' ? 'CREDITO' : 'DEBITO',
        valor: Math.abs(ofxTransacao.amount),
        fornecedorOuSocio: 'N/A',
        documento: 'N/A',
        descricao: ofxTransacao.description,
        lancado: 'NAOLANCADO',
        tipoRelacionamento: null,
        relacionadoId: null,
        manualSelectionNeeded: true
      };

      // Adicionar à lista apropriada
      if (ofxTransacao.type === 'credit') {
        creditTransacoes.push(transacaoDto);
      } else {
        debitTransacoes.push(transacaoDto);
      }

      // Criar também uma transação pendente como fallback
      const pendente: TransacaoPendente = {
        id: index + 1,
        data: ofxTransacao.date,
        tipo: ofxTransacao.type === 'credit' ? 'CREDITO' : 'DEBITO',
        valor: Math.abs(ofxTransacao.amount),
        descricao: ofxTransacao.description,
        documento: 'N/A',
        fornecedorOuSocio: 'N/A',
        dataImportacao: new Date().toISOString().split('T')[0],
        arquivoOrigem: 'desconhecido',
        processado: false
      };
      transacoesPendentes.push(pendente);
    });

    return {
      creditTransacoes,
      debitTransacoes,
      transacoesPendentes
    };
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