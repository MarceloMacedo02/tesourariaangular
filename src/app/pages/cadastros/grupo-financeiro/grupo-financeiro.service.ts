import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GrupoFinanceiro, Page } from './grupo-financeiro.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoFinanceiroService {
  private apiUrl = `${environment.apiBaseUrl}/api/grupos-financeiros`;

  constructor(private http: HttpClient) { }

  getGruposFinanceiros(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<GrupoFinanceiro>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<GrupoFinanceiro>>(this.apiUrl, { params });
  }

  getGrupoFinanceiroById(id: number): Observable<GrupoFinanceiro> {
    return this.http.get<GrupoFinanceiro>(`${this.apiUrl}/${id}`);
  }

  createGrupoFinanceiro(grupoFinanceiro: GrupoFinanceiro): Observable<GrupoFinanceiro> {
    return this.http.post<GrupoFinanceiro>(this.apiUrl, grupoFinanceiro);
  }

  updateGrupoFinanceiro(id: number, grupoFinanceiro: GrupoFinanceiro): Observable<GrupoFinanceiro> {
    return this.http.put<GrupoFinanceiro>(`${this.apiUrl}/${id}`, grupoFinanceiro);
  }

  deleteGrupoFinanceiro(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  getCentrosCusto(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/centros-custo`);
  }
}