import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CobrancaAvulsa, ContaPagar, Page, Socio, Fornecedor, Rubrica, GrupoMensalidade, ContaFinanceira } from './financeiro.model';

/**
 * Serviço para obtenção de dados do Dashboard Financeiro
 */
@Injectable({
  providedIn: 'root'
})
export class DashboardFinanceiroService {
  private apiUrl = `${environment.apiBaseUrl}/api/dashboard-financeiro`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém o resumo financeiro do dashboard
   */
  getResumoFinanceiro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/resumo`);
  }

  /**
   * Obtém as contas a vencer nos próximos dias
   */
  getContasAVencer(dias: number = 7): Observable<any[]> {
    let params = new HttpParams().set('dias', dias.toString());
    return this.http.get<any[]>(`${this.apiUrl}/contas-a-vencer`, { params });
  }

  /**
   * Obtém as contas vencidas
   */
  getContasVencidas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/contas-vencidas`);
  }

  /**
   * Obtém o fluxo de caixa para os próximos dias
   */
  getFluxoCaixa(dias: number = 30): Observable<any[]> {
    let params = new HttpParams().set('dias', dias.toString());
    return this.http.get<any[]>(`${this.apiUrl}/fluxo-caixa`, { params });
  }

  /**
   * Obtém as movimentações recentes
   */
  getMovimentacoesRecentes(dias: number = 7): Observable<any[]> {
    let params = new HttpParams().set('dias', dias.toString());
    return this.http.get<any[]>(`${this.apiUrl}/movimentacoes-recentes`, { params });
  }
}

/**
 * Serviço para gerenciamento de Contas a Receber (Cobranças)
 */
@Injectable({
  providedIn: 'root'
})
export class ContasReceberService {
  private apiUrl = `${environment.apiBaseUrl}/api/cobrancas`;

  constructor(private http: HttpClient) { }

  /**
   * Cria uma nova cobrança avulsa
   */
  criarCobrancaAvulsa(cobranca: CobrancaAvulsa): Observable<CobrancaAvulsa> {
    return this.http.post<CobrancaAvulsa>(`${this.apiUrl}/salvar-avulsa`, cobranca);
  }

  /**
   * Registra o pagamento de uma cobrança
   */
  registrarPagamento(id: number, contaFinanceiraId: number): Observable<CobrancaAvulsa> {
    return this.http.post<CobrancaAvulsa>(
      `${this.apiUrl}/registrar-pagamento/${id}?contaFinanceiraId=${contaFinanceiraId}`, 
      {}
    );
  }

  /**
   * Lista todas as cobranças
   */
  listarCobrancas(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<CobrancaAvulsa>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    
    return this.http.get<Page<CobrancaAvulsa>>(this.apiUrl, { params });
  }

  /**
   * Obtém uma cobrança específica pelo ID
   */
  obterCobrancaPorId(id: number): Observable<CobrancaAvulsa> {
    return this.http.get<CobrancaAvulsa>(`${this.apiUrl}/${id}`);
  }

  /**
   * Filtra cobranças por status
   */
  filtrarPorStatus(status: string, page: number = 0, size: number = 30): Observable<Page<CobrancaAvulsa>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<CobrancaAvulsa>>(`${this.apiUrl}/status/${status}`, { params });
  }

  /**
   * Filtra cobranças por sócio
   */
  filtrarPorSocio(socioId: number, page: number = 0, size: number = 30): Observable<Page<CobrancaAvulsa>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<CobrancaAvulsa>>(`${this.apiUrl}/socio/${socioId}`, { params });
  }
}

/**
 * Serviço para gerenciamento de Contas a Pagar
 */
@Injectable({
  providedIn: 'root'
})
export class ContasPagarService {
  private apiUrl = `${environment.apiBaseUrl}/api/contas-a-pagar`;

  constructor(private http: HttpClient) { }

  /**
   * Cria uma nova conta a pagar
   */
  criarContaPagar(conta: ContaPagar): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(`${this.apiUrl}/salvar`, conta);
  }

  /**
   * Registra o pagamento de uma conta a pagar
   */
  registrarPagamento(id: number, contaFinanceiraId: number): Observable<ContaPagar> {
    return this.http.post<ContaPagar>(
      `${this.apiUrl}/registrar-pagamento/${id}?contaFinanceiraId=${contaFinanceiraId}`, 
      {}
    );
  }

  /**
   * Lista todas as contas a pagar
   */
  listarContasPagar(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<ContaPagar>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    
    return this.http.get<Page<ContaPagar>>(this.apiUrl, { params });
  }

  /**
   * Obtém uma conta a pagar específica pelo ID
   */
  obterContaPagarPorId(id: number): Observable<ContaPagar> {
    return this.http.get<ContaPagar>(`${this.apiUrl}/${id}`);
  }

  /**
   * Filtra contas a pagar por status
   */
  filtrarPorStatus(status: string, page: number = 0, size: number = 30): Observable<Page<ContaPagar>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<ContaPagar>>(`${this.apiUrl}/status/${status}`, { params });
  }

  /**
   * Filtra contas a pagar por fornecedor
   */
  filtrarPorFornecedor(fornecedorId: number, page: number = 0, size: number = 30): Observable<Page<ContaPagar>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<Page<ContaPagar>>(`${this.apiUrl}/fornecedor/${fornecedorId}`, { params });
  }
}

/**
 * Serviço para obtenção de dados auxiliares (sócios, fornecedores, rubricas, etc.)
 */
@Injectable({
  providedIn: 'root'
})
export class DadosAuxiliaresService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista de sócios ativos
   */
  getSociosAtivos(): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.apiUrl}/api/socios/ativos`);
  }

  /**
   * Obtém a lista de fornecedores ativos
   */
  getFornecedoresAtivos(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.apiUrl}/api/fornecedores/ativos`);
  }

  /**
   * Obtém a lista de rubricas
   */
  getRubricas(): Observable<Rubrica[]> {
    return this.http.get<Page<Rubrica>>(`${this.apiUrl}/api/rubricas?page=0&size=1000`)
      .pipe(
        // Em uma implementação real, isso seria feito com um pipe map para extrair o conteúdo
      );
  }

  /**
   * Obtém a lista de grupos de mensalidade
   */
  getGruposMensalidade(): Observable<GrupoMensalidade[]> {
    return this.http.get<Page<GrupoMensalidade>>(`${this.apiUrl}/api/grupos-mensalidade?page=0&size=1000`)
      .pipe(
        // Em uma implementação real, isso seria feito com um pipe map para extrair o conteúdo
      );
  }

  /**
   * Obtém a lista de contas financeiras
   */
  getContasFinanceiras(): Observable<ContaFinanceira[]> {
    return this.http.get<Page<ContaFinanceira>>(`${this.apiUrl}/api/contas-financeiras?page=0&size=1000`)
      .pipe(
        // Em uma implementação real, isso seria feito com um pipe map para extrair o conteúdo
      );
  }
}