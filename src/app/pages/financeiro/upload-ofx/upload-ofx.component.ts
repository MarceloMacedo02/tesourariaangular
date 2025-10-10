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
  
  // Estatísticas da importação
  nomeArquivo?: string;
  totalTransacoesProcessadas?: number;
  totalCreditos?: number;
  totalDebitos?: number;
  totalPendentes?: number;
  totalDuplicadosIgnorados?: number;
  mensagemResumo?: string;
  
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

    // Chamar o serviço no endpoint correto
    this.transacoesOfxService.importarOFX(formData).subscribe({
      next: (response: TransacaoProcessingResult) => {
        this.creditTransacoes = response.creditTransacoes || [];
        this.debitTransacoes = response.debitTransacoes || [];
        this.transacoesPendentes = response.transacoesPendentes || [];
        
        // Armazenar os dados estatísticos da resposta
        this.nomeArquivo = response.nomeArquivo;
        this.totalTransacoesProcessadas = response.totalTransacoesProcessadas;
        this.totalCreditos = response.totalCreditos;
        this.totalDebitos = response.totalDebitos;
        this.totalPendentes = response.totalPendentes;
        this.totalDuplicadosIgnorados = response.totalDuplicadosIgnorados;
        this.mensagemResumo = response.mensagemResumo;
        
        // Atualizar mensagem para usar a estrutura completa da nova resposta
        const totalCreditos = response.totalCreditos ?? this.creditTransacoes.length;
        const totalDebitos = response.totalDebitos ?? this.debitTransacoes.length;
        const totalPendentes = response.totalPendentes ?? this.transacoesPendentes.length;
        const totalProcessadas = response.totalTransacoesProcessadas ?? (totalCreditos + totalDebitos + totalPendentes);
        const totalDuplicados = response.totalDuplicadosIgnorados ?? 0;
        
        this.mensagem = response.mensagemResumo || 
          `Processamento concluído: ${totalProcessadas} transações analisadas, ${totalCreditos} créditos, ${totalDebitos} débitos, ${totalPendentes} pendentes, ${totalDuplicados} duplicados ignorados.`;
        
        this.carregando = false;
      },
      error: (error) => {
        console.error('Erro ao importar OFX:', error);
        
        // Verificar se é um erro de autorização (403)
        if (error.status === 403) {
          this.mensagem = 'Acesso negado: você não tem permissão para importar arquivos OFX. Verifique suas credenciais.';
        } else if (error.status === 401) {
          this.mensagem = 'Sessão expirada: faça login novamente para continuar.';
        } else if (error.status === 0) {
          this.mensagem = 'Erro de conexão: não foi possível se conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.status === 404) {
          this.mensagem = 'Endpoint não encontrado: verifique se o backend está configurado corretamente e o serviço de importação OFX está ativo.';
        } else {
          this.mensagem = `Erro ao processar arquivo: ${error.error?.message || error.message || 'Erro desconhecido'}`;
        }
        
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
        
        // Verificar se é um erro de autorização (403)
        if (error.status === 403) {
          this.mensagem = 'Acesso negado: você não tem permissão para associar transações. Verifique suas credenciais.';
        } else if (error.status === 401) {
          this.mensagem = 'Sessão expirada: faça login novamente para continuar.';
        } else if (error.status === 0) {
          this.mensagem = 'Erro de conexão: não foi possível se conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.status === 404) {
          this.mensagem = 'Endpoint não encontrado: verifique se o backend está configurado corretamente.';
        } else {
          this.mensagem = 'Erro ao associar transação: ' + (error.error?.message || error.message || 'Erro desconhecido');
        }
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
        
        // Verificar se é um erro de autorização (403)
        if (error.status === 403) {
          this.mensagem = 'Acesso negado: você não tem permissão para descartar transações. Verifique suas credenciais.';
        } else if (error.status === 401) {
          this.mensagem = 'Sessão expirada: faça login novamente para continuar.';
        } else if (error.status === 0) {
          this.mensagem = 'Erro de conexão: não foi possível se conectar ao servidor. Verifique se o backend está rodando.';
        } else if (error.status === 404) {
          this.mensagem = 'Endpoint não encontrado: verifique se o backend está configurado corretamente.';
        } else {
          this.mensagem = 'Erro ao descartar transação: ' + (error.error?.message || error.message || 'Erro desconhecido');
        }
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
          
          // Verificar se é um erro de autorização (403)
          if (error.status === 403) {
            this.mensagem = 'Acesso negado: você não tem permissão para remover transações. Verifique suas credenciais.';
          } else if (error.status === 401) {
            this.mensagem = 'Sessão expirada: faça login novamente para continuar.';
          } else if (error.status === 0) {
            this.mensagem = 'Erro de conexão: não foi possível se conectar ao servidor. Verifique se o backend está rodando.';
          } else if (error.status === 404) {
            this.mensagem = 'Endpoint não encontrado: verifique se o backend está configurado corretamente.';
          } else {
            this.mensagem = 'Erro ao remover transações: ' + (error.error?.message || error.message || 'Erro desconhecido');
          }
        }
      });
    }
  }
}