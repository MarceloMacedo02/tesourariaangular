import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoDetalhadaPage } from '../../../models/transacao-detalhada.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-transacoes-debito',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transacoes-debito.component.html',
  styleUrls: ['./transacoes-debito.component.scss']
})
export class TransacoesDebitoComponent implements OnInit {
  // Filtros
  mesFiltro: number = new Date().getMonth() + 1; // mês atual
  anoFiltro: number = new Date().getFullYear(); // ano atual
  pagina: number = 0;
  tamanhoPagina: number = 30;
  
  // Dados
  transacoes: TransacaoDetalhadaPage | null = null;
  carregando: boolean = false;

  constructor(
    private transacoesService: TransacoesOfxService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buscarTransacoes();
  }

  buscarTransacoes(): void {
    this.carregando = true;
    
    this.transacoesService.getTransacoesDetalhadasPorMesAno(
      this.anoFiltro, 
      this.mesFiltro, 
      'DEBITO', 
      this.pagina, 
      this.tamanhoPagina
    ).pipe(
      catchError(error => {
        console.error('Erro ao buscar transações:', error);
        this.carregando = false;
        return of({ 
          content: [], 
          totalElements: 0, 
          totalPages: 0, 
          last: true, 
          first: true, 
          number: 0, 
          size: 0, 
          numberOfElements: 0, 
          empty: true,
          pageable: {
            sort: { empty: true, sorted: false, unsorted: true },
            offset: 0,
            pageNumber: 0,
            pageSize: 30,
            unpaged: false
          },
          sort: { empty: true, sorted: false, unsorted: true }
        } as TransacaoDetalhadaPage);
      })
    ).subscribe({
      next: (response) => {
        this.transacoes = response;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao buscar transações:', error);
        this.carregando = false;
      }
    });
  }

  mudarPagina(numeroPagina: number): void {
    if (numeroPagina >= 0 && numeroPagina < (this.transacoes?.totalPages || 0)) {
      this.pagina = numeroPagina;
      this.buscarTransacoes();
    }
  }

  getRange(start: number, end: number): number[] {
    const range: number[] = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }
  
  getStartPage(): number {
    return this.transacoes ? Math.max(0, this.transacoes.number - 2) : 0;
  }
  
  getEndPage(): number {
    return this.transacoes ? Math.min(this.transacoes.totalPages - 1, this.transacoes.number + 2) : 0;
  }

  darBaixa(transacaoId: number): void {
    // Navegar para a página de baixa de transação com o ID da transação
    this.router.navigate(['/financeiro/transacoes/baixa', transacaoId]);
  }
}