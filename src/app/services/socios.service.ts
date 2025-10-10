import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SociosService {
  private apiUrl = `${environment.apiBaseUrl}/api/socios`;

  constructor(private http: HttpClient) {}

  getAllSocios(): Observable<any[]> {
    // Actual implementation for the endpoint /api/socios
    return this.http.get<any[]>(this.apiUrl);
  }

  getSocioById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}