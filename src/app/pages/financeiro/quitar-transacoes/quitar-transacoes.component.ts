import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransacoesService } from '../../../services/transacoes.service';
import { Transacao } from '../../../models/transacao.model';

@Component({
  selector: 'app-quitar-transacoes',
  templateUrl: './quitar-transacoes.component.html',
  styleUrls: ['./quitar-transacoes.component.css']
})
export class QuitarTransacoesComponent implements OnInit {
  anoFiltro: number | null = null;
  mesFiltro: number | null = null;
  transacoes: Transacao[] = [];
  carregando = false;
  mensagem: string = '';
  filtroAplicado = false;

  constructor(
    private transacoesService: TransacoesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Por padrão, pode mostrar o mês e ano atual
    const dataAtual = new Date();
    this.anoFiltro = dataAtual.getFullYear();
    this.mesFiltro = dataAtual.getMonth() + 1;
  }

  buscarTransacoes(): void {
    if (!this.anoFiltro || !this.mesFiltro) {
      this.mensagem = 'Por favor, selecione o ano e o mês.';
      return;
    }

    this.carregando = true;
    this.mensagem = '';
    this.filtroAplicado = true;

    this.transacoesService.getTransacoesPorMesAno({
      ano: this.anoFiltro,
      mes: this.mesFiltro
    }).subscribe({
      next: (data) => {
        this.transacoes = data;
        this.carregando = false;
        if (data.length === 0) {
          this.mensagem = 'Nenhuma transação encontrada para o mês/ano selecionado.';
        } else {
          this.mensagem = `Foram encontradas ${data.length} transações.`;
        }
      },
      error: (error) => {
        console.error('Erro ao buscar transações:', error);
        this.mensagem = `Erro ao buscar transações: ${error.message || 'Erro desconhecido'}`;
        this.carregando = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'LANCADO':
        return 'bg-success';
      case 'NAOLANCADO':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  getStatusDisplayText(status: string): string {
    switch(status) {
      case 'LANCADO':
        return 'Quitado';
      case 'NAOLANCADO':
        return 'Em Aberto';
      default:
        return status;
    }
  }

  quitarTransacao(id: number): void {
    // Navegar para a página de detalhe da transação que permite quitação
    this.router.navigate([`/detalhe-transacao/${id}`]);
  }
}