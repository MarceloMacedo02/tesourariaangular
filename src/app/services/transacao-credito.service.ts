import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Socio {
  id: number;
  nomeSocio: string;
}

export interface Cobranca {
  id: number;
  socioId: number;
  socioNome: string;
  rubricaId: number | null;
  rubricaNome: string | null;
  fornecedorId: number | null;
  fornecedorNome: string | null;
  grupoMensalidadeId: number | null;
  grupoMensalidadeNome: string | null;
  tipoCobranca: string;
  valorOriginal: number | null;
  valorPago: number | null;
  dataVencimento: string; // formato ISO 8601
  dataPagamento: string | null; // formato ISO 8601
  status: string;
  descricao: string;
  dataRegistro: string | null; // formato ISO 8601
  valor: number;
  mesLancamento: number;
  anoLancamento: number;
}

export interface TransacaoDetalhada {
  id: number;
  dataVencimento: string; // formato ISO 8601
  dataPagamento: string | null; // formato ISO 8601
  valor: number;
  descricao: string;
  status: string;
  socio: Socio | null;
  fornecedor: Fornecedor | null;
  listaDeCobrancaMensalidade: Cobranca[];
  listaDeCobrancaOutrasRubricas: Cobranca[];
  listaDeCobrancaAvulsa: Cobranca[];
}

export interface CobrancaQuitadaResponse {
  id: number;
  socioId: number;
  socioNome: string;
  rubricaId: number;
  rubricaNome: string;
  fornecedorId: number | null;
  fornecedorNome: string | null;
  grupoMensalidadeId: number | null;
  grupoMensalidadeNome: string | null;
  tipoCobranca: string;
  valorOriginal: number;
  valorPago: number;
  dataVencimento: string; // formato ISO 8601
  dataPagamento: string; // formato ISO 8601
  status: string;
  descricao: string;
  dataRegistro: string; // formato ISO 8601
}

// Interfaces para os dados auxiliares
export interface Socio {
  id: number;
  nomeSocio: string;
}

export interface Fornecedor {
  id: number;
  nomeFornecedor: string;
}

export interface ContaFinanceira {
  id: number;
  nome: string;
}

export interface Rubrica {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransacaoCreditoService {
  private apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private http: HttpClient) {}

  /**
   * Consulta uma transação com cobranças do sócio
   * Endpoint: GET /api/transacoes/{id}
   */
  getTransacaoDetalhada(id: number): Observable<TransacaoDetalhada> {
    return this.http.get<TransacaoDetalhada>(
      `${this.apiUrl}/transacoes-detalhadas/${id}`
    );
  }

  /**
   * Registra o pagamento/quitação de uma cobrança
   * Endpoint: POST /api/cobrancas/registrar-pagamento/{id}?contaFinanceiraId={contaFinanceiraId}
   */
  registrarPagamentoCobranca(
    id: number,
    contaFinanceiraId: number
  ): Observable<CobrancaQuitadaResponse> {
    const url = `${this.apiUrl}/cobrancas/registrar-pagamento/${id}?contaFinanceiraId=${contaFinanceiraId}`;
    return this.http.post<CobrancaQuitadaResponse>(url, {});
  }

  /**
   * Método para quitar cobranças selecionadas
   * Chamada de conveniência que itera pelas cobranças e chama o endpoint de quitação individualmente
   */
  quitarCobrancas(
    transacaoId: number,
    contaFinanceiraId: number,
    cobrancasIds: number[]
  ): Observable<any[]> {
    // Criar um array de observables para cada cobrança a ser paga
    const requests = cobrancasIds.map((id) =>
      this.registrarPagamentoCobranca(id, contaFinanceiraId)
    );

    // Retornar um observable que completa quando todos os pagamentos são registrados
    return new Observable((observer) => {
      // Processar todas as requisições em paralelo
      let completedRequests = 0;
      let results: any[] = [];
      let hasErrors = false;
      let errors: any[] = [];

      if (requests.length === 0) {
        observer.next([]);
        observer.complete();
        return;
      }

      requests.forEach((request, index) => {
        request.subscribe({
          next: (result) => {
            results[index] = result;
            completedRequests++;

            if (completedRequests === requests.length) {
              if (hasErrors) {
                observer.error(errors);
              } else {
                observer.next(results);
                observer.complete();
              }
            }
          },
          error: (error) => {
            hasErrors = true;
            errors[index] = error;
            completedRequests++;

            if (completedRequests === requests.length) {
              observer.error(errors);
            }
          },
        });
      });
    });
  }

  /**
   * Obter lista de sócios
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  getSocios(): Observable<Socio[]> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.get<Socio[]>(`${this.apiUrl}/socios`);
  }

  /**
   * Obter lista de contas financeiras
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  getContasFinanceiras(): Observable<ContaFinanceira[]> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.get<ContaFinanceira[]>(
      `${this.apiUrl}/contas-financeiras`
    );
  }

  /**
   * Obter lista de rubricas
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  getRubricas(): Observable<Rubrica[]> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.get<Rubrica[]>(`${this.apiUrl}/rubricas`);
  }

  /**
   * Associar sócio à transação
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  associarSocio(
    transacaoId: number,
    socioId: number
  ): Observable<TransacaoDetalhada> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.post<TransacaoDetalhada>(
      `${this.apiUrl}/transacoes/${transacaoId}/associar-socio`,
      { socioId }
    );
  }

  /**
   * Adicionar conta a receber
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  adicionarContaReceber(transacaoId: number, dadosConta: any): Observable<any> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.post<any>(
      `${this.apiUrl}/transacoes/${transacaoId}/contas-receber`,
      dadosConta
    );
  }

  /**
   * Atualizar conta a receber
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  atualizarContaReceber(contaId: number, dadosConta: any): Observable<any> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.put<any>(
      `${this.apiUrl}/contas-receber/${contaId}`,
      dadosConta
    );
  }

  /**
   * Excluir conta a receber
   * Endpoint fictício - pode precisar ser ajustado conforme a API real
   */
  excluirContaReceber(contaId: number): Observable<any> {
    // Este endpoint pode não existir na API real - ajustar conforme necessário
    return this.http.delete<any>(`${this.apiUrl}/contas-receber/${contaId}`);
  }

  /**
   * Criar nova cobrança
   * Endpoint: POST /api/cobrancas
   */
  criarCobranca(dadosCobranca: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cobrancas`, dadosCobranca);
  }

  /**
   * Atualizar cobrança existente
   * Endpoint: PUT /api/cobrancas/{id}
   */
  atualizarCobranca(id: number, dadosCobranca: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/cobrancas/${id}`, dadosCobranca);
  }

  /**
   * Obter lista de rubricas (simples - apenas id e nome)
   * Endpoint: GET /api/simples/rubricas
   */
  getRubricasSimples(): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(`${this.apiUrl}/simples/rubricas`);
  }
}