import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GrupoMensalidade } from '../../grupo-mensalidade/grupo-mensalidade.model';
import { GrupoMensalidadeService } from '../../grupo-mensalidade/grupo-mensalidade.service';
import { Page, Socio } from '../socio.model';
import { SocioService } from '../socio.service';

@Component({
  selector: 'app-cobranca-lote',
  templateUrl: './cobranca-lote.component.html',
  styles: [],
})
export class CobrancaLoteComponent implements OnInit {
  cobrancaForm: FormGroup;
  socios: Socio[] = [];
  gruposMensalidade: GrupoMensalidade[] = [];
  page: Page<Socio> = {} as Page<Socio>;
  currentPage = 0;
  pageSize = 30;
  pageSizeOptions = [20, 30, 50, 100];
  filtro = '';
  loading = false;
  loadingGrupos = false;
  sociosSelecionados: number[] = [];
  resultadoGeracao: any = null;

  // Toast
  toastMessage: WritableSignal<string | null> = signal(null);
  toastType: WritableSignal<'success' | 'error' | 'warning' | 'info'> = signal('info');

  constructor(
    private formBuilder: FormBuilder,
    private socioService: SocioService,
    private grupoMensalidadeService: GrupoMensalidadeService
  ) {
    this.cobrancaForm = this.formBuilder.group({
      mes: [
        new Date().getMonth() + 1,
        [Validators.required, Validators.min(1), Validators.max(12)],
      ],
      ano: [
        new Date().getFullYear(),
        [Validators.required, Validators.min(2000), Validators.max(3000)],
      ],
    });
  }

  ngOnInit(): void {
    this.loadGruposMensalidade();
    this.loadSocios();
  }

  loadGruposMensalidade(): void {
    this.loadingGrupos = true;
    // Primeiro, obtemos todos os grupos de mensalidade
    this.grupoMensalidadeService.getAllGruposMensalidade().subscribe({
      next: (data: GrupoMensalidade[]) => {
        this.gruposMensalidade = data;
        this.loadingGrupos = false;
      },
      error: (error: any) => {
        console.error('Erro ao carregar grupos de mensalidade:', error);
        this.loadingGrupos = false;
      },
    });
  }

  loadSocios(): void {
    this.loading = true;
    this.socioService
      .getSocios(this.currentPage, this.pageSize, this.filtro)
      .subscribe({
        next: (response: Page<Socio>) => {
          this.page = response;
          this.socios = response.content;
          this.loading = false;
        },
        error: (error: any) => {
          console.error('Erro ao carregar sócios:', error);
          this.loading = false;
        },
      });
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.page.totalPages) {
      this.currentPage = page;
      this.loadSocios();
    }
  }

  onFiltroChange(): void {
    this.currentPage = 0; // Resetar para a primeira página ao alterar o filtro
    this.loadSocios();
  }

  onPageSizeChange(newSize: number): void {
    if (this.pageSize !== newSize) {
      this.pageSize = newSize;
      this.currentPage = 0; // Voltar para a primeira página ao mudar o tamanho da página
      this.loadSocios();
    }
  }

  getStatusText(status: string): string {
    return status || 'Desconhecido';
  }

  getStatusBadgeClass(status: string): string {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'ativo':
      case 'frequente':
        return 'bg-success';
      case 'inativo':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }

  getGrauSocioText(grau: string): string {
    return grau || 'Desconhecido';
  }

  getVisiblePages(): number[] {
    const totalPages = this.page.totalPages;
    const currentPage = this.currentPage;

    if (totalPages <= 7) {
      // Se tiver 7 ou menos páginas, mostrar todas
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    // Caso contrário, mostrar com abreviação
    const pages = [];

    // Primeira página sempre visível
    pages.push(0);

    if (currentPage > 3) {
      pages.push(-1); // Indicador de "..."
    }

    // Determinar o intervalo de páginas ao redor da página atual
    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 4) {
      pages.push(-1); // Indicador de "..."
    }

    // Última página sempre visível (se for diferente da anterior)
    if (totalPages > 1) {
      pages.push(totalPages - 1);
    }

    return pages;
  }

  getGrupoMensalidadeNome(grupoMensalidadeId: number | undefined): string {
    if (!grupoMensalidadeId) {
      return '-';
    }
    const grupo = this.gruposMensalidade.find(
      (g) => g.id === grupoMensalidadeId
    );
    return grupo ? grupo.nomeGrupoMensalidade : 'Grupo não encontrado';
  }

  // Método para obter o valor total do grupo de mensalidade (soma dos valores das rubricas)
  getValorMensalidade(grupoMensalidadeId: number | undefined): number {
    if (!grupoMensalidadeId) {
      return 0;
    }
    const grupo = this.gruposMensalidade.find(
      (g) => g.id === grupoMensalidadeId
    );
    // Calcular a soma dos valores das rubricas do grupo (itensRubricaMensalidade)
    if (grupo && grupo.itensRubricaMensalidade) {
      return grupo.itensRubricaMensalidade.reduce(
        (total, item) => total + (item.valor || 0),
        0
      );
    }
    return 0;
  }

  selecionarTodos(event: any): void {
    if (event.target.checked) {
      this.sociosSelecionados = this.socios
        .map((s) => s.id!)
        .filter((id) => id !== undefined) as number[];
    } else {
      this.sociosSelecionados = [];
    }
  }

  alternarSelecao(socioId: number | undefined): void {
    if (socioId === undefined) return;

    const index = this.sociosSelecionados.indexOf(socioId);
    if (index > -1) {
      this.sociosSelecionados.splice(index, 1);
    } else {
      this.sociosSelecionados.push(socioId);
    }
  }

  isSocioSelecionado(socioId: number | undefined): boolean {
    return socioId ? this.sociosSelecionados.includes(socioId) : false;
  }

  gerarCobrancas(): void {
    if (this.cobrancaForm.invalid) {
      return;
    }

    this.loading = true; // Mostrar o indicador de carregamento
    this.resultadoGeracao = null; // Limpar resultado anterior

    const { mes, ano } = this.cobrancaForm.value;

    // Se nenhum sócio estiver selecionado, gera para todos os membros ativos
    if (this.sociosSelecionados.length === 0) {
      // Opção 3: Generate for all active members (specific month/year)
      this.socioService
        .gerarCobrancasMensalidade(mes, ano)
        .subscribe({
          next: (response) => {
            this.tratarRespostaCobranca(response);
          },
          error: (error) => {
            this.tratarErroCobranca(error);
          }
        });
    } else {
      // Opção 2: Generate for specific members (specific month/year)
      this.socioService
        .gerarCobrancasMensalidade(mes, ano, this.sociosSelecionados)
        .subscribe({
          next: (response) => {
            this.tratarRespostaCobranca(response);
          },
          error: (error) => {
            this.tratarErroCobranca(error);
          }
        });
    }
  }

  private tratarRespostaCobranca(response: any): void {
    this.resultadoGeracao = response;
    this.loading = false; // Esconder o indicador de carregamento
    console.log('Cobranças geradas com sucesso:', response);

    // Mostrar mensagem de sucesso se não houver detalhes no response
    if (!response.mensagem) {
      // Criar mensagem padrão se o backend não retornar uma
      const mensagem = `Cobranças geradas com sucesso para ${this.sociosSelecionados.length > 0 ? this.sociosSelecionados.length : (response.length || 0)} sócios!`;
      this.showCustomToast(mensagem, 'success');
    } else {
      this.showCustomToast(response.mensagem, 'success');
    }
  }

  private tratarErroCobranca(error: any): void {
    console.error('Erro ao gerar cobranças:', error);
    this.loading = false; // Esconder o indicador de carregamento

    // Exibir mensagem de erro
    const mensagemErro = error.error?.message || error.message || 'Erro desconhecido ao gerar cobranças';
    this.showCustomToast(mensagemErro, 'error');
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
        return 'bg-success text-white';
      case 'error':
        return 'bg-danger text-white';
      case 'warning':
        return 'bg-warning text-white';
      case 'info':
        return 'bg-info text-white';
      default:
        return 'bg-secondary text-white';
    }
  }
}