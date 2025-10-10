import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Sessao } from '../models/sessao.model';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {
  constructor() { }

  getSessaoAtual(): Observable<Sessao> {
    // Mock implementation - replace with actual API call
    const mockSessao: Sessao = {
      id: 1,
      usuario: 'admin',
      dataLogin: new Date().toISOString(),
      duracaoSessao: 3600,
      ativo: true
    };
    return of(mockSessao);
    // Actual implementation would be:
    // return this.http.get<Sessao>('/api/sessao/atual');
  }
}