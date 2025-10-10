import {
  ChangeDetectionStrategy,
  Component,
  computed,
  OnInit,
  signal,
  WritableSignal,
  inject,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TransacaoCreditoService, TransacaoDetalhada } from '../../../../../services/transacao-credito.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transacoes-credito-editar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transacoes-credito-editar.component.html',
  styleUrl: './transacoes-credito-editar.component.scss',
})
export class TransacoesCreditoEditarComponent implements OnInit {
  // --- DADOS CARREGADOS VIA SERVIÇO ---

  // Signals para armazenar os dados carregados
  readonly transacao: WritableSignal<TransacaoDetalhada | null> =
    signal(null);
  readonly contasMensalidade: WritableSignal<any[]> = signal([]);
  readonly contasOutrasRubricas: WritableSignal<any[]> = signal([]);
  readonly socios: WritableSignal<any[]> = signal([]);
  readonly contasFinanceiras: WritableSignal<any[]> = signal([]);
  readonly rubricas: WritableSignal<any[]> = signal([]);

  // Nova propriedade para armazenar a descrição da transação
  readonly descricaoTransacao: WritableSignal<string> = signal('');

  // Simulando a variável de contexto Thymeleaf
  readonly fromTitular: number | null = 1; // Se != null, exibe o botão "Voltar ao Sócio Titular"
  readonly warning: WritableSignal<string | null> = signal(null);

  // --- ESTADO DO COMPONENTE ---
  activeTab = 'detalhes-transacao'; // Controla a aba ativa
  selectedCobrancaIds: WritableSignal<number[]> = signal([]);
  selectedContaFinanceiraId: number | null = null;
  errors: string[] = [];
  breadCrumbItems!: Array<{}>;

  // Modais
  isAssociarSocioModalOpen: WritableSignal<boolean> = signal(false);
  isNovaContaReceberModalOpen: WritableSignal<boolean> = signal(false);
  isEditContaReceberModalOpen: WritableSignal<boolean> = signal(false);
  isExcluirContaReceberModalOpen: WritableSignal<boolean> = signal(false);

  // Dados do Modal
  modalSocioId: number | null = null;
  novaConta = {
    rubricaId: null as number | null,
    descricao: '',
    dataVencimento: '',
    valor: 0.0,
  };
  editConta: any = {}; // Objeto para armazenar dados da conta sendo editada
  contaParaExcluir: WritableSignal<any | null> = signal(null);

  // Toast
  toastMessage: WritableSignal<string | null> = signal(null);
  toastType: WritableSignal<'success' | 'error' | 'warning' | 'info'> =
    signal('info');

  // --- MÉTODOS PARA SELEÇÃO EM MASSA ---
  toggleAllSelection(tab: string) {
    const allIds = this.getAllIdsForTab(tab);
    const selectedIds = this.selectedCobrancaIds();
    
    if (selectedIds.length === allIds.length) {
      // Deselecionar todos (remover todos os IDs do tab do array selecionado)
      this.selectedCobrancaIds.update(ids => 
        ids.filter(id => !allIds.includes(id))
      );
    } else {
      // Selecionar todos (adicionar todos os IDs do tab ao array selecionado)
      const newIds = [...new Set([...selectedIds, ...allIds])];
      this.selectedCobrancaIds.set(newIds);
    }
    // Forçar detecção de mudanças para atualizar a interface imediatamente
    this.cdr.detectChanges();
  }

  isAllSelected(tab: string): boolean {
    const allIds = this.getAllIdsForTab(tab);
    const selectedIds = this.selectedCobrancaIds();
    
    return allIds.length > 0 && allIds.every(id => selectedIds.includes(id));
  }

  private getAllIdsForTab(tab: string): number[] {
    switch (tab) {
      case 'contas-mensalidade':
        return this.contasMensalidade().map(c => c.id);
      case 'outras-rubricas':
        return this.contasOutrasRubricas().map(c => c.id);
      default:
        return [];
    }
  }

  // --- LÓGICA DE CÁLCULO (COMPUTED SIGNALS) ---



  // NOVO: Calcula o total das Cobranças de Mensalidades selecionadas
  totalMensalidadeSelecionado = computed(() => {
    return this.contasMensalidade()
      .filter((c) => this.selectedCobrancaIds().includes(c.id))
      .reduce((sum, c) => sum + (c.valor || 0), 0);
  });

  // NOVO: Calcula o total das Cobranças de Outras Rubricas selecionadas
  totalOutrasRubricasSelecionado = computed(() => {
    return this.contasOutrasRubricas()
      .filter((c) => this.selectedCobrancaIds().includes(c.id))
      .reduce((sum, c) => sum + (c.valor || 0), 0);
  });

  // Calcula o total geral de TUDO selecionado
  grandTotalReceber = computed(() => {
    return (
      this.totalMensalidadeSelecionado() +
      this.totalOutrasRubricasSelecionado()
    );
  });

  // Verifica se o total selecionado corresponde ao valor da transação
  isTotalMatching = computed(() => {
    const transacao = this.transacao();
    if (!transacao) return false;

    const transacaoValor = transacao.valor;
    const totalSelecionado = this.grandTotalReceber();
    // Usar uma pequena tolerância para evitar problemas de ponto flutuante
    const tolerance = 0.001;
    return Math.abs(totalSelecionado - transacaoValor) < tolerance;
  });

  totalDiferenca = computed(() => {
    const transacao = this.transacao();
    if (!transacao) return 0;

    return transacao.valor - this.grandTotalReceber();
  });

  // Habilita o botão de Quitar Cobranças
  isQuitarButtonEnabled = computed(() => {
    const isContaFinanceiraSelected = !!this.selectedContaFinanceiraId;
    const hasSelections = this.selectedCobrancaIds().length > 0;
    const transacao = this.transacao();

    return (
      transacao !== null &&
      this.isTotalMatching() &&
      isContaFinanceiraSelected &&
      hasSelections
    );
  });

  constructor(
    private transacaoCreditoService: TransacaoCreditoService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      { label: 'Financeiro' },
      { label: 'Transações', active: true }
    ];

    // Carregar os dados iniciais com base no ID da rota
    this.route.params.subscribe((params) => {
      const id = params['id'] ? Number(params['id']) : 101; // Padrão para 101 se não for fornecido
      this.carregarDados(id);
    });
  }

  carregarDados(id: number): void {
    // Carregar dados da transação detalhada
    this.transacaoCreditoService.getTransacaoDetalhada(id).subscribe({
      next: (data) => {
        this.transacao.set(data);
        // Mapear as listas de cobrança para as variáveis correspondentes usando os nomes corretos do modelo atualizado
        this.contasMensalidade.set(data.listaDeCobrancaMensalidade || []);
        this.contasOutrasRubricas.set(data.listaDeCobrancaOutrasRubricas || []);
      },
      error: (err) => {
        console.error('Erro ao carregar transação detalhada:', err);
        this.showCustomToast(
          'Erro ao carregar os dados da transação.',
          'error'
        );
      },
    });

    // Carregar outras listas (mantendo as chamadas existentes ou substituindo por novos endpoints conforme necessário)
    // Para esta implementação, vamos manter as chamadas existentes
    this.transacaoCreditoService.getSocios().subscribe({
      next: (data) => this.socios.set(data),
      error: (err) => {
        console.error('Erro ao carregar sócios:', err);
        this.showCustomToast('Erro ao carregar sócios.', 'error');
      },
    });

    this.transacaoCreditoService.getContasFinanceiras().subscribe({
      next: (data) => this.contasFinanceiras.set(data),
      error: (err) => {
        console.error('Erro ao carregar contas financeiras:', err);
        this.showCustomToast('Erro ao carregar contas financeiras.', 'error');
      },
    });

    this.transacaoCreditoService.getRubricas().subscribe({
      next: (data) => this.rubricas.set(data),
      error: (err) => {
        console.error('Erro ao carregar rubricas:', err);
        this.showCustomToast('Erro ao carregar rubricas.', 'error');
      },
    });
  }

  // --- MÉTODOS DE AÇÃO ---

  // Toggle de seleção de Cobranças/Contas a Receber
  toggleSelection(id: number, valor: number) {
    this.selectedCobrancaIds.update((ids) => {
      if (ids.includes(id)) {
        return ids.filter((i) => i !== id);
      } else {
        return [...ids, id];
      }
    });
    // Forçar detecção de mudanças para atualizar a interface imediatamente
    this.cdr.detectChanges();
  }

  // Quitar Cobranças
  quitarCobrancas() {
    if (!this.selectedContaFinanceiraId) {
      this.showCustomToast(
        'Selecione uma conta financeira para quitar as cobranças.',
        'warning'
      );
      return;
    }

    if (this.selectedCobrancaIds().length === 0) {
      this.showCustomToast(
        'Selecione pelo menos uma cobrança para quitar.',
        'warning'
      );
      return;
    }

    const transacao = this.transacao();
    if (!transacao) {
      this.showCustomToast('Nenhuma transação para quitar.', 'error');
      return;
    }

    // Chama o serviço para quitar as cobranças
    this.transacaoCreditoService
      .quitarCobrancas(
        transacao.id,
        this.selectedContaFinanceiraId,
        this.selectedCobrancaIds()
      )
      .subscribe({
        next: (response) => {
          this.showCustomToast(`Cobranças quitadas com sucesso!`, 'success');

          // Atualizar o estado após quitação
          this.selectedCobrancaIds.set([]);
          this.selectedContaFinanceiraId = null;

          // Atualizar a transação
          if (this.transacao()) {
            this.transacao.update((t) => ({ ...t!, status: 'QUITADA' }));
          }

          // Recarregar os dados
          this.carregarDados(transacao.id);
        },
        error: (err) => {
          console.error('Erro ao quitar cobranças:', err);
          this.showCustomToast('Erro ao quitar cobranças.', 'error');
        },
      });
  }

  // Associar Sócio
  associarSocio() {
    if (!this.modalSocioId) {
      this.showCustomToast('Selecione um sócio antes de associar.', 'warning');
      return;
    }

    const transacao = this.transacao();
    if (!transacao) {
      this.showCustomToast('Nenhuma transação para associar sócio.', 'error');
      return;
    }

    this.transacaoCreditoService
      .associarSocio(transacao.id, this.modalSocioId)
      .subscribe({
        next: (response) => {
          // Atualizar a transação com o novo sócio
          const socioSelecionado = this.socios().find(
            (s) => s.id === this.modalSocioId
          );

          this.transacao.update((t) => ({
            ...t!,
            // Atualiza o sócio na transação
            socio: socioSelecionado
              ? {
                  id: socioSelecionado.id,
                  nomeSocio: socioSelecionado.nomeSocio,
                }
              : null,
            fornecedor: null, // Remove o fornecedor se um sócio for associado
          }));

          this.isAssociarSocioModalOpen.set(false);
          this.modalSocioId = null;
          this.showCustomToast(
            `Sócio '${socioSelecionado?.nomeSocio}' associado com sucesso!`,
            'success'
          );
        },
        error: (err) => {
          console.error('Erro ao associar sócio:', err);
          this.showCustomToast('Erro ao associar sócio.', 'error');
        },
      });
  }

  // Salvar Nova Conta a Receber (Sempre Avulsa neste modal)
  salvarNovaContaReceber() {
    if (
      !this.novaConta.rubricaId ||
      !this.novaConta.descricao ||
      !this.novaConta.dataVencimento ||
      this.novaConta.valor <= 0
    ) {
      this.showCustomToast(
        'Por favor, preencha todos os campos da nova conta.',
        'warning'
      );
      return;
    }

    // Este método pode precisar ser adaptado para o novo modelo de dados
    // Por enquanto, vamos mostrar uma mensagem indicando que a funcionalidade não está disponível
    this.showCustomToast(
      'A funcionalidade de adicionar contas avulsas não está disponível com o novo modelo de dados.',
      'warning'
    );
    
    // Fechar o modal
    this.isNovaContaReceberModalOpen.set(false);
    this.novaConta = {
      rubricaId: null,
      descricao: '',
      dataVencimento: '',
      valor: 0.0,
    };
  }

  // Abrir Edição (Apenas para Avulsas - será desativado temporariamente)
  openEditContaReceberModal(conta: any) {
    // Mostrar mensagem que a edição não está disponível com o novo modelo
    this.showCustomToast(
      'A edição de contas não está disponível com o novo modelo de dados.',
      'warning'
    );
  }

  // Salvar Edição
  salvarEdicaoContaReceber() {
    // Mostrar mensagem que a edição não está disponível com o novo modelo
    this.showCustomToast(
      'A edição de contas não está disponível com o novo modelo de dados.',
      'warning'
    );
    
    this.isEditContaReceberModalOpen.set(false);
  }

  // Abrir Exclusão
  openExcluirContaReceberModal(conta: any) {
    // Mostrar mensagem que a exclusão não está disponível com o novo modelo
    this.showCustomToast(
      'A exclusão de contas não está disponível com o novo modelo de dados.',
      'warning'
    );
  }

  // Confirmação de Exclusão
  confirmarExclusao() {
    // Mostrar mensagem que a exclusão não está disponível com o novo modelo
    this.showCustomToast(
      'A exclusão de contas não está disponível com o novo modelo de dados.',
      'warning'
    );
    
    this.isExcluirContaReceberModalOpen.set(false);
    this.contaParaExcluir.set(null);
  }

  // Função de Toast
  showCustomToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 5000);
  }

  getToastClasses(type: 'success' | 'error' | 'warning' | 'info') {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }
}
