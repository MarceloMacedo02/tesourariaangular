import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransacoesService } from '../../services/transacoes.service';
import { Transacao } from '../../models/transacao.model';

@Component({
  selector: 'app-detalhe-transacao',
  templateUrl: './detalhe-transacao.component.html',
  styleUrls: ['./detalhe-transacao.component.css']
})
export class DetalheTransacaoComponent implements OnInit {
  transacao: Transacao | null = null;
  carregando = true;
  idTransacao: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transacoesService: TransacoesService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idTransacao = +params['id'];
      if (this.idTransacao) {
        this.carregarTransacao();
      } else {
        this.carregando = false;
        console.error('ID da transação não fornecido');
      }
    });
  }

  carregarTransacao(): void {
    if (this.idTransacao) {
      this.transacoesService.getTransacaoById(this.idTransacao).subscribe({
        next: (transacao) => {
          this.transacao = transacao;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar transação:', error);
          this.carregando = false;
        }
      });
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

  getRelacionamentoDisplayText(tipo: string): string {
    switch(tipo) {
      case 'SOCIO':
        return 'Sócio';
      case 'FORNECEDOR':
        return 'Fornecedor';
      case 'NAO_ENCONTRADO':
        return 'Não Encontrado';
      default:
        return tipo;
    }
  }

  voltarLista(): void {
    this.router.navigate(['/pages/financeiro/quitar-transacoes']);
  }

  quitarTransacao(): void {
    if (this.transacao && this.idTransacao) {
      // Confirmar quitação com o usuário
      const confirmado = confirm(`Tem certeza que deseja quitar a transação "${this.transacao.descricao}" no valor de ${this.transacao.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}?`);
      
      if (confirmado) {
        // Chamar o serviço para quitar a transação
        this.transacoesService.quitarTransacao(this.idTransacao).subscribe({
          next: (transacaoAtualizada) => {
            this.transacao = transacaoAtualizada;
            alert('Transação quitada com sucesso!');
          },
          error: (error) => {
            console.error('Erro ao quitar transação:', error);
            alert('Erro ao quitar transação. Por favor, tente novamente.');
          }
        });
      }
    }
  }
}