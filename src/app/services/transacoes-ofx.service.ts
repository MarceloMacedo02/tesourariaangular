import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  ApiResponseStructure,
  OfxUploadResponse,
  ReferenciasFinanceiras,
  TransacaoDto,
  TransacaoPendente,
  TransacaoProcessingResult,
} from '../models/transacao-ofx.model';
import { TransacaoDetalhadaPage, TransacaoDetalhada } from '../models/transacao-detalhada.model';
import { TransacaoResponse } from '../models/transacao-response.model';
import {
  Fornecedor,
  ReferenciasFinanceirasService,
  Rubrica,
  Socio,
} from '../services/referencias-financeiras.service';

@Injectable({
  providedIn: 'root',
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
  importarOFX(
    formData: FormData,
    accountId?: number
  ): Observable<TransacaoProcessingResult> {
    // Criar novo FormData com o arquivo e o accountId se fornecido
    const requestFormData = new FormData();
    const file = formData.get('file') as File;
    requestFormData.append('file', file);

    if (accountId !== undefined) {
      requestFormData.append('accountId', accountId.toString());
    }

    // Faz a requisição com tipagem para a nova estrutura de resposta
    return this.http
      .post<ApiResponseStructure | OfxUploadResponse>(
        `${this.baseUrl}/api/transacoes/importar-ofx`,
        requestFormData
      )
      .pipe(
        // Mapear a resposta conforme a estrutura recebida
        map((response) => {
          // Verificar se a resposta tem a estrutura esperada com 'resultado' (nova estrutura)
          if ('resultado' in response) {
            const apiResponse = response as ApiResponseStructure;
            // A resposta tem a estrutura: { resultado: { ... }, message: '...' }
            // O resultado contém as listas de transações
            return {
              creditTransacoes: apiResponse.resultado.creditTransacoes || [],
              debitTransacoes: apiResponse.resultado.debitTransacoes || [],
              transacoesPendentes: apiResponse.resultado.transacoesPendentes || [],
            };
          } else {
            // É a estrutura antiga, converter normalmente
            return this.transformOfxResponseToLegacy(response as OfxUploadResponse);
          }
        }),
        // Adicionar tratamento de erro caso a resposta não seja do tipo esperado
        map((result) => {
          // Verificar se o resultado é válido
          if (!result || !Array.isArray(result.creditTransacoes) || !Array.isArray(result.debitTransacoes) || !Array.isArray(result.transacoesPendentes)) {
            console.error('Resposta inválida do método de transformação:', result);
            return {
              creditTransacoes: [],
              debitTransacoes: [],
              transacoesPendentes: []
            };
          }
          return result;
        })
      );
  }

  /**
   * Método auxiliar para converter a nova resposta para o formato antigo
   */
  private transformOfxResponseToLegacy(
    response: OfxUploadResponse
  ): TransacaoProcessingResult {
    const creditTransacoes: TransacaoDto[] = [];
    const debitTransacoes: TransacaoDto[] = [];
    const transacoesPendentes: TransacaoPendente[] = [];

    // Verificar se a resposta contém a estrutura esperada
    if (!response || !response.data || !response.data.transactions) {
      console.error('Estrutura de resposta inválida:', response);
      return {
        creditTransacoes,
        debitTransacoes,
        transacoesPendentes,
      };
    }

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
        manualSelectionNeeded: true,
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
        processado: false,
        lancado: 'NAOLANCADO',
      };
      transacoesPendentes.push(pendente);
    });

    return {
      creditTransacoes,
      debitTransacoes,
      transacoesPendentes,
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
    return this.http.get<TransacaoPendente[]>(
      `${this.baseUrl}/api/transacoes/pendentes`
    );
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
    return new Observable((observer) => {
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
              rubricas,
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        },
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
              rubricas,
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        },
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
              rubricas,
            });
            observer.complete();
          }
        },
        error: (error) => {
          observer.error(error);
        },
      });
    });
  }

  /**
   * Obter transações de débito (despesas)
   */
  getTransacoesDebito(): Observable<TransacaoDto[]> {
    // Simulando retorno de despesas - substituir pela chamada real ao backend
    return this.getTodasTransacoes().pipe(
      map(
        (transacoes) =>
          transacoes.filter((t) => t.tipo === 'DEBITO') as TransacaoDto[]
      )
    );
  }

  /**
   * Obter transações de crédito (receitas)
   */
  getTransacoesCredito(): Observable<TransacaoDto[]> {
    // Simulando retorno de receitas - substituir pela chamada real ao backend
    return this.getTodasTransacoes().pipe(
      map(
        (transacoes) =>
          transacoes.filter((t) => t.tipo === 'CREDITO') as TransacaoDto[]
      )
    );
  }

  /**
   * Obter todas as transações (método que parece faltar também)
   */
  getTodasTransacoes(): Observable<(TransacaoDto | TransacaoPendente)[]> {
    // Simulação temporária - substituir pela chamada real ao backend
    return of([]);
  }

  /**
   * Método para ignorar/destacar uma transação
   */
  ignorarTransacao(id: number): Observable<any> {
    // Simulação - substituir pela chamada real ao backend
    return of({});
  }

  /**
   * Método para obter transação pendente por ID
   */
  getTransacaoPendenteById(id: number): Observable<TransacaoPendente> {
    // Simulação - substituir pela chamada real ao backend
    return of({
      id: id,
      data: '',
      tipo: 'CREDITO',
      valor: 0,
      descricao: '',
      documento: '',
      fornecedorOuSocio: '',
      dataImportacao: '',
      arquivoOrigem: '',
      processado: false,
      lancado: 'NAOLANCADO',
    } as TransacaoPendente);
  }

  /**
   * Método para associar transação
   */
  associarTransacao(transacaoId: number, dados: any): Observable<any> {
    // Simulação - substituir pela chamada real ao backend
    return of({});
  }

  /**
   * Método para obter transações pendentes
   */
  getTransacoesPendentes(): Observable<TransacaoPendente[]> {
    // Simulação - substituir pela chamada real ao backend
    return of([]);
  }

  /**
   * Obtém transações detalhadas com paginação e filtros por mês/ano e tipo
   */
  getTransacoesDetalhadasPorMesAno(
    ano: number,
    mes: number,
    tipo: 'CREDITO' | 'DEBITO' | null = null,
    page: number = 0,
    size: number = 30
  ): Observable<any> { // Usando any temporariamente para lidar com a estrutura real da API
    let url = `${this.baseUrl}/api/transacoes-detalhadas?mes=${mes}&ano=${ano}&page=${page}&size=${size}`;
    if (tipo) {
      url += `&tipo=${tipo}`;
    }
    return this.http.get<any>(url); // A resposta real da API não segue o modelo TransacaoDetalhadaPage
  }
  
  /**
   * Obtém uma transação detalhada específica por ID
   */
  getTransacaoDetalhadaPorId(id: number): Observable<any> {
    const url = `${this.baseUrl}/api/transacoes-detalhadas/${id}`;
    return this.http.get<any>(url);
  }

  /**
   * Obtém transações por mês e ano com paginação
   */
  getTransacoesPorMesAno(
    ano: number,
    mes: number,
    page: number = 0,
    size: number = 30
  ): Observable<TransacaoResponse> {
    const params = new URLSearchParams({
      ano: ano.toString(),
      mes: mes.toString(),
      page: page.toString(),
      size: size.toString(),
    });
    return this.http.get<TransacaoResponse>(
      `${this.baseUrl}/api/transacoes/por-mes-ano?${params}`
    );
  }
}
