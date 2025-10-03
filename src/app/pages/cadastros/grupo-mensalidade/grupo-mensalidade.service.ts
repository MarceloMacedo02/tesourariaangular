import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GrupoMensalidade, Page, Rubrica } from './grupo-mensalidade.model';
import { environment } from 'src/environments/environment';

/**
 * Serviço para gerenciamento de Grupos de Mensalidade
 * Campos dataRegistro, dataAtualizacao e dataCriacao são de uso exclusivo do backend
 * e não devem ser manipulados no frontend
 */
@Injectable({
  providedIn: 'root'
})
export class GrupoMensalidadeService {

  private apiUrl = `${environment.apiBaseUrl}/api/grupos-mensalidade`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista paginada de grupos de mensalidade
   * Retorna campos dataRegistro, dataAtualizacao e dataCriacao que são de uso exclusivo do backend
   */
  getGruposMensalidade(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<GrupoMensalidade>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<GrupoMensalidade>>(this.apiUrl, { params });
  }

  /**
   * Obtém um grupo de mensalidade específico pelo ID
   * Retorna campos dataRegistro, dataAtualizacao e dataCriacao que são de uso exclusivo do backend
   */
  getGrupoMensalidadeById(id: number): Observable<GrupoMensalidade> {
    return this.http.get<GrupoMensalidade>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria um novo grupo de mensalidade
   * Campos dataRegistro, dataAtualizacao e dataCriacao são gerenciados exclusivamente pelo backend
   */
  createGrupoMensalidade(grupoMensalidade: GrupoMensalidade): Observable<GrupoMensalidade> {
    return this.http.post<GrupoMensalidade>(this.apiUrl, grupoMensalidade);
  }

  /**
   * Atualiza um grupo de mensalidade existente
   * Campos dataRegistro, dataAtualizacao e dataCriacao são gerenciados exclusivamente pelo backend
   */
  updateGrupoMensalidade(id: number, grupoMensalidade: GrupoMensalidade): Observable<GrupoMensalidade> {
    return this.http.put<GrupoMensalidade>(`${this.apiUrl}/${id}`, grupoMensalidade);
  }

  /**
   * Exclui um grupo de mensalidade
   */
  deleteGrupoMensalidade(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Exclui um item de rubrica de mensalidade
   */
  deleteItemRubricaMensalidade(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/itens/${id}`);
  }

  /**
   * Obtém os itens de rubrica associados a um grupo de mensalidade
   */
  getItensRubrica(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/itens`);
  }

  /**
   * Obtém a lista de rubricas ativas para uso no formulário
   */
  getRubricas(): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(`${this.apiUrl}/rubricas`);
  }
  
  /**
   * Obtém a lista de todos os grupos de mensalidade (sem paginação)
   */
  getAllGruposMensalidade(): Observable<GrupoMensalidade[]> {
    // Usando o mesmo endpoint mas com parâmetros para obter todos os registros
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '1000'); // Tamanho grande para pegar todos os registros
    
    return this.http.get<Page<GrupoMensalidade>>(this.apiUrl, { params }).pipe(
      map(response => response.content) // Pegar apenas o conteúdo da página
    );
  }
}