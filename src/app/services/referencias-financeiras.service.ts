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
  tipo: string;
}

export interface Socio {
  id: number;
  nome: string;
}

export interface CentroCusto {
  id: number;
  descricao: string;
}

export interface ReferenciasFinanceiras {
  socios: Socio[];
  fornecedores: Fornecedor[];
  rubricas: Rubrica[];
  centrosCusto: CentroCusto[];
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

  // Buscar todos os centros de custo
  getCentrosCusto(): Observable<CentroCusto[]> {
    return this.http.get<CentroCusto[]>(`${this.baseUrl}/api/centro-custo`);
  }

  // Métodos alternativos com nome diferente para compatibilidade
  getAllSocios(): Observable<Socio[]> {
    return this.getSocios();
  }

  getAllFornecedores(): Observable<Fornecedor[]> {
    return this.getFornecedores();
  }

  getAllRubricas(): Observable<Rubrica[]> {
    return this.getRubricas();
  }
}
