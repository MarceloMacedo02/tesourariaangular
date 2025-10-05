import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransacoesOfxService } from '../../../services/transacoes-ofx.service';
import { 
  TransacaoDto, 
  TransacaoPendente, 
  TransacaoProcessingResult,
  ReferenciasFinanceiras 
} from '../../../models/transacao-ofx.model';
import { Fornecedor, Rubrica, Socio } from '../../../services/referencias-financeiras.service';

@Component({
  selector: 'app-upload-ofx',
  templateUrl: './upload-ofx.component.html',
  styleUrls: ['./upload-ofx.component.css']
})
export class UploadOfxComponent implements OnInit {
  uploadForm: FormGroup;
  arquivoSelecionado: File | null = null;
  mensagem: string = '';
  carregando: boolean = false;
  
  // Resultados do processamento
  creditTransacoes: TransacaoDto[] = [];
  debitTransacoes: TransacaoDto[] = [];
  transacoesPendentes: TransacaoPendente[] = [];
  
  // Para associação manual
  referencias: ReferenciasFinanceiras = { socios: [], fornecedores: [], rubricas: [] };
  tipoRelacionamento: 'SOCIO' | 'FORNECEDOR' | '' = '';
  relacionadoId: number | null = null;
  transacaoPendenteAtual: TransacaoPendente | null = null;
  
  constructor(
    private fb: FormBuilder,
    private transacoesOfxService: TransacoesOfxService
  ) {
    this.uploadForm = this.fb.group({
      arquivo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarReferencias();
  }

  carregarReferencias(): void {
    // Carregar sócios e fornecedores para seleção manual
    this.transacoesOfxService.getReferenciasFinanceiras().subscribe({
      next: (data) => {
        this.referencias = data;
      },
      error: (error) => {
        console.error('Erro ao carregar referências:', error);
        this.mensagem = 'Erro ao carregar referências financeiras.';
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      // Verificar extensão do arquivo
      const extensao = file.name.split('.').pop()?.toLowerCase();
      if (extensao === 'ofx') {
        this.arquivoSelecionado = file;
        this.mensagem = `Arquivo selecionado: ${file.name}`;
      } else {
        this.mensagem = 'Por favor, selecione um arquivo OFX válido.';
        this.arquivoSelecionado = null;
      }
    }
  }

  uploadOFX(): void {
    if (!this.arquivoSelecionado) {
      this.mensagem = 'Por favor, selecione um arquivo OFX primeiro.';
      return;
    }

    this.carregando = true;
    this.mensagem = 'Processando arquivo OFX...';

    const formData = new FormData();
    formData.append('file', this.arquivoSelecionado);

    // Chamar o serviço sem o parâmetro accountId
    this.transacoesOfxService.importarOFX(formData).subscribe({
      next: (response: TransacaoProcessingResult) => {
        this.creditTransacoes = response.creditTransacoes;
        this.debitTransacoes = response.debitTransacoes;
        this.transacoesPendentes = response.transacoesPendentes;
        
        this.mensagem = `Processamento concluído: ${this.creditTransacoes.length} créditos, ${this.debitTransacoes.length} débitos, ${this.transacoesPendentes.length} pendentes.`;
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao importar OFX:', error);
        this.mensagem = `Erro ao processar arquivo: ${error.error?.message || error.message || 'Erro desconhecido'}`;
        this.carregando = false;
      }
    });
  }

  associarTransacaoPendente(pendente: TransacaoPendente): void {
    if (!this.relacionadoId || !this.tipoRelacionamento) {
      alert('Por favor, selecione um sócio ou fornecedor e o tipo de relacionamento.');
      return;
    }

    if (!pendente) {
      alert('Nenhuma transação pendente selecionada.');
      return;
    }

    this.transacoesOfxService.associarPendente(pendente.id, this.relacionadoId, this.tipoRelacionamento).subscribe({
      next: (response: TransacaoDto) => {
        // Atualizar a transação pendente na lista
        const index = this.transacoesPendentes.findIndex(t => t.id === pendente.id);
        if (index !== -1) {
          // Remover da lista de pendentes
          this.transacoesPendentes.splice(index, 1);
        }
        
        // Adicionar à lista apropriada (crédito ou débito)
        if (response.tipo === 'CREDITO') {
          this.creditTransacoes.push(response);
        } else {
          this.debitTransacoes.push(response);
        }
        
        // Limpar seleção
        this.relacionadoId = null;
        this.tipoRelacionamento = '';
        this.transacaoPendenteAtual = null;
        
        this.mensagem = 'Transação associada com sucesso!';
      },
      error: (error) => {
        console.error('Erro ao associar transação:', error);
        this.mensagem = 'Erro ao associar transação: ' + (error.error?.message || error.message || 'Erro desconhecido');
      }
    });
  }

  descartarTransacaoPendente(id: number): void {
    this.transacoesOfxService.descartarPendente(id).subscribe({
      next: () => {
        // Remover da lista de pendentes
        this.transacoesPendentes = this.transacoesPendentes.filter(t => t.id !== id);
        this.mensagem = 'Transação descartada com sucesso!';
      },
      error: (error) => {
        console.error('Erro ao descartar transação:', error);
        this.mensagem = 'Erro ao descartar transação: ' + (error.error?.message || error.message || 'Erro desconhecido');
      }
    });
  }

  removerTransacoesPorArquivo(nomeArquivo: string): void {
    if (confirm(`Tem certeza que deseja remover todas as transações associadas ao arquivo ${nomeArquivo}?`)) {
      this.transacoesOfxService.removerPorArquivo(nomeArquivo).subscribe({
        next: () => {
          this.mensagem = 'Transações removidas com sucesso!';
          // Limpar as listas após remoção
          this.creditTransacoes = [];
          this.debitTransacoes = [];
          this.transacoesPendentes = [];
        },
        error: (error) => {
          console.error('Erro ao remover transações:', error);
          this.mensagem = 'Erro ao remover transações: ' + (error.error?.message || error.message || 'Erro desconhecido');
        }
      });
    }
  }
}