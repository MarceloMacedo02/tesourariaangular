import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CentroCusto, Page } from './centro-custo.model';

@Injectable({
  providedIn: 'root'
})
export class CentroCustoService {
  private apiUrl = '/api/centros-custo';

  constructor(private http: HttpClient) { }

  getCentrosCusto(page: number = 0, size: number = 30, filtro: string = ''): Observable<Page<CentroCusto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('filtro', filtro);
    
    return this.http.get<Page<CentroCusto>>(this.apiUrl, { params });
  }

  getCentroCustoById(id: number): Observable<CentroCusto> {
    return this.http.get<CentroCusto>(`${this.apiUrl}/${id}`);
  }

  createCentroCusto(centroCusto: CentroCusto): Observable<CentroCusto> {
    return this.http.post<CentroCusto>(this.apiUrl, centroCusto);
  }

  updateCentroCusto(id: number, centroCusto: CentroCusto): Observable<CentroCusto> {
    return this.http.put<CentroCusto>(`${this.apiUrl}/${id}`, centroCusto);
  }

  deleteCentroCusto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}