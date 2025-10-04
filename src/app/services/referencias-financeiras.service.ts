import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Fornecedor {
  id: number;
  nome: string;
}

export interface Rubrica {
  id: number;
  nome: string;
}

export interface Socio {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReferenciasFinanceirasService {
  private baseUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient) {}

  // Buscar todos os fornecedores
  getFornecedores(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(
      `${this.baseUrl}/api/simples/fornecedores`
    );
  }

  // Buscar todas as rubricas
  getRubricas(): Observable<Rubrica[]> {
    return this.http.get<Rubrica[]>(`${this.baseUrl}/api/simples/rubricas`);
  }

  // Buscar todos os sócios
  getSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.baseUrl}/api/simples/socios`);
  }
}
