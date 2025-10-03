import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rubrica, Page } from './rubricas.model';
import { environment } from 'src/environments/environment';

/**
 * Serviço para gerenciamento de Rubricas
 * Campo dataCriacao é de uso exclusivo do backend e não deve ser manipulado no frontend
 */
@Injectable({
  providedIn: 'root'
})
export class RubricasService {
  private apiUrl = `${environment.apiBaseUrl}/api/rubricas`;

  constructor(private http: HttpClient) { }

  /**
   * Obtém a lista paginada de rubricas
   * Retorna campo dataCriacao que é de uso exclusivo do backend
   */
  getRubricas(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<Rubrica>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<Rubrica>>(this.apiUrl, { params });
  }

  /**
   * Obtém uma rubrica específica pelo ID
   * Retorna campo dataCriacao que é de uso exclusivo do backend
   */
  getRubricaById(id: number): Observable<Rubrica> {
    return this.http.get<Rubrica>(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria uma nova rubrica
   * Campo dataCriacao é gerenciado exclusivamente pelo backend
   */
  createRubrica(rubrica: Rubrica): Observable<Rubrica> {
    return this.http.post<Rubrica>(this.apiUrl, rubrica);
  }

  /**
   * Atualiza uma rubrica existente
   * Campo dataCriacao é gerenciado exclusivamente pelo backend
   */
  updateRubrica(id: number, rubrica: Rubrica): Observable<Rubrica> {
    return this.http.put<Rubrica>(`${this.apiUrl}/${id}`, rubrica);
  }

  /**
   * Exclui uma rubrica
   */
  deleteRubrica(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  /**
   * Obtém a lista de rubricas ativas
   */
  getRubricasAtivas(): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(`${this.apiUrl}/ativas`);
  }
  
  /**
   * Obtém a lista de grupos financeiros para uso no formulário
   */
  getGruposFinanceiros(): Observable<any[]> {
    // Usando o mesmo endpoint mas com parâmetros para obter todos os registros
    let params = new HttpParams()
      .set('page', '0')
      .set('size', '1000'); // Tamanho grande para pegar todos os registros
    
    return this.http.get<Page<any>>(`${environment.apiBaseUrl}/api/grupos-financeiros`, { params }).pipe(
      map(response => response.content) // Pegar apenas o conteúdo da página
    );
  }
}