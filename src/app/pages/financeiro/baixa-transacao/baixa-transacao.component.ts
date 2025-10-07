import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { TransacaoDetalhada } from '../../../models/transacao-detalhada.model';
import { TransacoesService } from '../../../services/transacoes.service';

@Component({
  selector: 'app-baixa-transacao',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './baixa-transacao.component.html',
  styleUrls: ['./baixa-transacao.component.scss']
})
export class BaixaTransacaoComponent implements OnInit {
  transacaoId: number | null = null;
  transacao: any = null; // any para lidar com a estrutura real da API
  carregando: boolean = false;
  mensagem: string = '';
  erro: boolean = false;
  
  // Controle dos checkboxes
  selectAllMensalidade: boolean = false;
  selectAllOutrasRubricas: boolean = false;
  selectAllAvulsa: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transacoesService: TransacoesOfxService,
    private transacoesGeraisService: TransacoesService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.transacaoId = +id;
        this.carregarTransacao();
      } else {
        this.mensagem = 'ID da transação não fornecido.';
        this.erro = true;
      }
    });
  }

  carregarTransacao(): void {
    if (this.transacaoId) {
      this.carregando = true;
      // Usar o endpoint específico para obter a transação detalhada por ID
      this.transacoesService.getTransacaoDetalhadaPorId(this.transacaoId).subscribe({
        next: (transacaoDetalhada) => {
          this.transacao = transacaoDetalhada;
          
          // Inicializar os checkboxes como selecionados por padrão
          if (this.transacao.listaDeCobrancaMensalidade) {
            this.transacao.listaDeCobrancaMensalidade.forEach((c: any) => c.selecionado = true);
            this.selectAllMensalidade = true;
          }
          if (this.transacao.listaDeCobrancaOutrasRubricas) {
            this.transacao.listaDeCobrancaOutrasRubricas.forEach((c: any) => c.selecionado = true);
            this.selectAllOutrasRubricas = true;
          }
          if (this.transacao.listaDeCobrancaAvulsa) {
            this.transacao.listaDeCobrancaAvulsa.forEach((c: any) => c.selecionado = true);
            this.selectAllAvulsa = true;
          }
          
          this.mensagem = '';
          this.erro = false;
          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao carregar transação detalhada:', error);
          this.mensagem = 'Erro ao carregar os dados detalhados da transação.';
          this.erro = true;
          this.carregando = false;
        }
      });
    }
  }

  // Métodos para manipular os checkboxes de mensalidade
  toggleAllMensalidade(checked: boolean): void {
    if (this.transacao && this.transacao.listaDeCobrancaMensalidade) {
      this.transacao.listaDeCobrancaMensalidade.forEach((c: any) => c.selecionado = checked);
    }
  }

  updateMensalidadeSelection(): void {
    if (this.transacao && this.transacao.listaDeCobrancaMensalidade) {
      const allSelected = this.transacao.listaDeCobrancaMensalidade.every((c: any) => c.selecionado);
      this.selectAllMensalidade = allSelected;
    }
  }

  // Métodos para manipular os checkboxes de outras rubricas
  toggleAllOutrasRubricas(checked: boolean): void {
    if (this.transacao && this.transacao.listaDeCobrancaOutrasRubricas) {
      this.transacao.listaDeCobrancaOutrasRubricas.forEach((c: any) => c.selecionado = checked);
    }
  }

  updateOutrasRubricasSelection(): void {
    if (this.transacao && this.transacao.listaDeCobrancaOutrasRubricas) {
      const allSelected = this.transacao.listaDeCobrancaOutrasRubricas.every((c: any) => c.selecionado);
      this.selectAllOutrasRubricas = allSelected;
    }
  }

  // Métodos para manipular os checkboxes de cobranças avulsas
  toggleAllAvulsa(checked: boolean): void {
    if (this.transacao && this.transacao.listaDeCobrancaAvulsa) {
      this.transacao.listaDeCobrancaAvulsa.forEach((c: any) => c.selecionado = checked);
    }
  }

  updateAvulsaSelection(): void {
    if (this.transacao && this.transacao.listaDeCobrancaAvulsa) {
      const allSelected = this.transacao.listaDeCobrancaAvulsa.every((c: any) => c.selecionado);
      this.selectAllAvulsa = allSelected;
    }
  }

  // Método para converter a resposta da API para o formato compatível
  private converterParaFormatoCompativel(response: any): any {
    return {
      ...response,
      content: response.content.map((transacao: any) => ({
        id: transacao.id,
        data: transacao.dataVencimento, // Usar dataVencimento como data
        descricao: transacao.descricao,
        valor: transacao.valor,
        tipo: 'CREDITO', // Pode ser CREDITO ou DEBITO dependendo do contexto
        categoria: 'Geral', // Categoria padrão
        socio: transacao.socio, // Pode ser null
        cobrancas: this.combinarCobrancas(transacao) // Combinar diferentes tipos de cobranças
      }))
    };
  }

  // Método para combinar diferentes tipos de cobranças em um formato único
  private combinarCobrancas(transacao: any): any[] {
    const cobrancas: any[] = [];
    
    // Processar cobranças de mensalidade
    transacao.listaDeCobrancaMensalidade.forEach((cobranca: any) => {
      cobrancas.push({
        tipoCobranca: 'MENSALIDADE',
        valor: cobranca.valor || transacao.valor,
        quantidade: 1
      });
    });
    
    // Processar cobranças de outras rubricas
    transacao.listaDeCobrancaOutrasRubricas.forEach((cobranca: any) => {
      cobrancas.push({
        tipoCobranca: 'OUTRAS_RUBRICAS',
        valor: cobranca.valor || transacao.valor,
        quantidade: 1
      });
    });
    
    // Processar cobranças avulsas
    transacao.listaDeCobrancaAvulsa.forEach((cobranca: any) => {
      cobrancas.push({
        tipoCobranca: 'AVULSA',
        valor: cobranca.valor || transacao.valor,
        quantidade: 1
      });
    });
    
    // Se nenhuma cobrança específica for encontrada, adicionar uma genérica
    if (cobrancas.length === 0) {
      cobrancas.push({
        tipoCobranca: 'GERAL',
        valor: transacao.valor,
        quantidade: 1
      });
    }
    
    return cobrancas;
  }

  darBaixa(): void {
    if (this.transacaoId) {
      this.carregando = true;
      this.mensagem = '';
      this.erro = false;
      
      this.transacoesGeraisService.quitarTransacao(this.transacaoId).subscribe({
        next: (transacaoAtualizada) => {
          this.mensagem = 'Transação quitada com sucesso!';
          this.erro = false;
          this.carregando = false;
          // Redirecionar após um breve período para mostrar a mensagem de sucesso
          setTimeout(() => {
            this.router.navigate(['/financeiro/transacoes/credito']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erro ao dar baixa na transação:', error);
          this.mensagem = 'Erro ao processar a baixa da transação. Tente novamente.';
          this.erro = true;
          this.carregando = false;
        }
      });
    }
  }

  voltar(): void {
    this.router.navigate(['/financeiro/transacoes/credito']);
  }
}
