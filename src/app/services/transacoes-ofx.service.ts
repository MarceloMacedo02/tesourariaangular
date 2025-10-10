import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  TransacaoDetalhada,
  TransacaoDetalhadaPage,
} from '../models/transacao-detalhada.model';
import {
  ReferenciasFinanceiras,
  TransacaoDto,
  TransacaoPendente,
  TransacaoProcessingResult,
} from '../models/transacao-ofx.model';
import { TransacaoResponse } from '../models/transacao-response.model';

@Injectable({
  providedIn: 'root',
})
export class TransacoesOfxService {
  private apiUrl = `${environment.apiBaseUrl}/api/transacoes`; // Base API URL from environment
  private ofxApiUrl = `${environment.apiBaseUrl}/api/ofx`; // OFX specific API URL
  private transacoesDetalhadasUrl = `${environment.apiBaseUrl}/api/transacoes-detalhadas`;

  constructor(private http: HttpClient) {}

  getTransacoesPendentes(): Observable<TransacaoPendente[]> {
    // Mock implementation - replace with actual API call
    return of([
      {
        id: 1,
        data: '2025-01-15',
        descricao: 'Pagamento de fornecedor',
        valor: 1200.0,
        tipo: 'DEBITO',
        lancado: 'NAOLANCADO',
        documento: 'DOC001',
        fornecedorOuSocio: 'Fornecedor Desconhecido',
        dataImportacao: '2025-01-10',
        arquivoOrigem: 'arquivo.ofx',
        processado: false,
        tipoRelacionamento: null,
        relacionadoId: null,
        fornecedorId: null,
        socioId: null,
        socioNome: null,
        statusIdentificacao: 'PENDENTE_ASSOCIACAO',
        caminhoComprovante: null,
        ativo: true,
      },
      {
        id: 2,
        data: '2025-01-20',
        descricao: 'Recebimento de cliente',
        valor: 2500.0,
        tipo: 'CREDITO',
        lancado: 'NAOLANCADO',
        documento: 'DOC002',
        fornecedorOuSocio: 'Cliente Desconhecido',
        dataImportacao: '2025-01-10',
        arquivoOrigem: 'arquivo.ofx',
        processado: false,
        tipoRelacionamento: null,
        relacionadoId: null,
        fornecedorId: null,
        socioId: null,
        socioNome: null,
        statusIdentificacao: 'PENDENTE_ASSOCIACAO',
        caminhoComprovante: null,
        ativo: true,
      },
    ]);
    // Actual implementation would be:
    // return this.http.get<TransacaoPendente[]>(`${this.apiUrl}/pendentes`);
  }

  getTransacoesPorMesAno(
    ano: number,
    mes: number,
    pagina: number,
    tamanho: number
  ): Observable<TransacaoResponse> {
    // Actual implementation for the endpoint /api/transacoes/por-mes-ano
    const params = `?ano=${ano}&mes=${mes}&page=${pagina}&size=${tamanho}`;
    return this.http.get<TransacaoResponse>(
      `${this.apiUrl}/por-mes-ano${params}`
    );
  }

  // Add missing methods required by upload-ofx.component
  getReferenciasFinanceiras(): Observable<ReferenciasFinanceiras> {
    // Mock implementation - replace with actual API call
    return of({
      socios: [
        { id: 1, nome: 'Sócio A' },
        { id: 2, nome: 'Sócio B' },
      ],
      fornecedores: [
        { id: 1, nome: 'Fornecedor X' },
        { id: 2, nome: 'Fornecedor Y' },
      ],
      rubricas: [
        { id: 1, nome: 'Rubrica 1' },
        { id: 2, nome: 'Rubrica 2' },
      ],
    });
    // Actual implementation would be:
    // return this.http.get<ReferenciasFinanceiras>(`${this.apiUrl}/referencias-financeiras`);
  }

  importarOFX(formData: FormData): Observable<TransacaoProcessingResult> {
    // Actual implementation for the endpoint /api/ofx/importar
    return this.http.post<TransacaoProcessingResult>(
      `${this.ofxApiUrl}/importar`,
      formData
    );
  }

  associarPendente(
    pendenteId: number,
    relacionadoId: number,
    tipoRelacionamento: 'SOCIO' | 'FORNECEDOR'
  ): Observable<TransacaoDto> {
    // Mock implementation - replace with actual API call
    return of({
      id: pendenteId,
      data: '2025-01-15',
      tipo: 'CREDITO',
      valor: 1500.0,
      fornecedorOuSocio: 'Cliente Associado',
      documento: 'DOC001',
      descricao: 'Transação associada',
      lancado: 'NAOLANCADO',
      tipoRelacionamento: tipoRelacionamento,
      relacionadoId: relacionadoId,
      fornecedorId: tipoRelacionamento === 'FORNECEDOR' ? relacionadoId : null,
      socioId: tipoRelacionamento === 'SOCIO' ? relacionadoId : null,
      socioNome: tipoRelacionamento === 'SOCIO' ? 'Nome do Sócio' : null,
      statusIdentificacao: 'IDENTIFICADO',
      caminhoComprovante: '',
      manualSelectionNeeded: false,
    });
    // Actual implementation would be:
    // return this.http.post<TransacaoDto>(`${this.apiUrl}/associar-pendente/${pendenteId}`, {
    //   relacionadoId,
    //   tipoRelacionamento
    // });
  }

  descartarPendente(id: number): Observable<any> {
    // Mock implementation - replace with actual API call
    return of({ success: true });
    // Actual implementation would be:
    // return this.http.post(`${this.apiUrl}/descartar-pendente/${id}`, {});
  }

  removerPorArquivo(nomeArquivo: string): Observable<any> {
    // Mock implementation - replace with actual API call
    return of({ success: true });
    // Actual implementation would be:
    // return this.http.delete(`${this.apiUrl}/remover-por-arquivo/${nomeArquivo}`);
  }

  associarTransacao(
    transacaoId: number,
    tipoRelacao: string,
    idRelacao: number
  ): Observable<any> {
    // Mock implementation - replace with actual API call
    console.log(
      `Associando transação ${transacaoId} com ${tipoRelacao} ${idRelacao}`
    );
    return of({ success: true });
    // Actual implementation would be:
    // return this.http.post(`${this.apiUrl}/${transacaoId}/associar`, { tipoRelacao, idRelacao });
  }

  getTransacaoDetalhada(id: number): Observable<TransacaoDetalhada> {
    // Actual implementation for the endpoint /api/transacoes/transacao/{id}
    return this.http.get<TransacaoDetalhada>(
      `${this.transacoesDetalhadasUrl}/${id}`
    );
  }

  getTransacoesDetalhadasPorMesAno(
    ano: number,
    mes: number,
    tipo: 'CREDITO' | 'DEBITO',
    pagina: number,
    tamanho: number
  ): Observable<TransacaoDetalhadaPage> {
    // Actual implementation for the endpoint /api/transacoes-detalhadas
    // Using exact specification: GET /api/transacoes-detalhadas?mes=X&ano=Y&tipo=Z&page=A&size=B
    const params = `?mes=${mes}&ano=${ano}&tipo=${tipo}&page=${pagina}&size=${tamanho}`;
    return this.http.get<TransacaoDetalhadaPage>(
      `${this.transacoesDetalhadasUrl}${params}`
    );
  }

  ignorarTransacao(transacaoId: number): Observable<any> {
    // Mock implementation - replace with actual API call
    console.log(`Ignorando transação ${transacaoId}`);
    return of({ success: true });
    // Actual implementation would be:
    // return this.http.post(`${this.apiUrl}/${transacaoId}/ignorar`, {});
  }

  quitarCobrancas(transacaoId: number, dados: any): Observable<any> {
    // Actual implementation for the endpoint /api/transacoes/{transacaoId}/quitar-cobrancas
    return this.http.post(`${this.apiUrl}/${transacaoId}/quitar-cobrancas`, dados);
  }

  associarSocioTransacao(transacaoId: number, dados: any): Observable<any> {
    // Actual implementation for the endpoint /api/transacoes/{transacaoId}/associar-socio
    return this.http.post(`${this.apiUrl}/${transacaoId}/associar-socio`, dados);
  }
}
