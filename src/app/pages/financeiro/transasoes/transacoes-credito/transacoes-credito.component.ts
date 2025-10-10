import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TransacaoDetalhadaPage } from '../../../../models/transacao-detalhada.model';
import { TransacoesOfxService } from '../../../../services/transacoes-ofx.service';

@Component({
  selector: 'app-transacoes-credito',
  standalone: false,
  template: `
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header align-items-center d-flex">
                <h4 class="card-title mb-0 flex-grow-1">
                  Transações de Crédito
                </h4>
                <div class="flex-shrink-0">
                  <button class="btn btn-primary" (click)="adicionarCobranca()">
                    <i class="fas fa-plus align-bottom me-1"></i> Adicionar
                    Cobrança
                  </button>
                </div>
              </div>
              <div class="card-body">
                <!-- Filtros -->
                <div class="row mb-4">
                  <div class="col-md-3">
                    <label for="mes" class="form-label">Mês</label>
                    <select
                      class="form-select"
                      id="mes"
                      [(ngModel)]="mesFiltro"
                      (ngModelChange)="buscarTransacoes()"
                    >
                      <option value="1">Janeiro</option>
                      <option value="2">Fevereiro</option>
                      <option value="3">Março</option>
                      <option value="4">Abril</option>
                      <option value="5">Maio</option>
                      <option value="6">Junho</option>
                      <option value="7">Julho</option>
                      <option value="8">Agosto</option>
                      <option value="9">Setembro</option>
                      <option value="10">Outubro</option>
                      <option value="11">Novembro</option>
                      <option value="12">Dezembro</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label for="ano" class="form-label">Ano</label>
                    <input
                      type="number"
                      class="form-control"
                      id="ano"
                      [(ngModel)]="anoFiltro"
                      [min]="2020"
                      [max]="2030"
                      (ngModelChange)="buscarTransacoes()"
                    />
                  </div>
                  <div class="col-md-3">
                    <label for="tamanhoPagina" class="form-label"
                      >Registros por página</label
                    >
                    <select
                      class="form-select"
                      id="tamanhoPagina"
                      [(ngModel)]="tamanhoPagina"
                      (ngModelChange)="buscarTransacoes()"
                    >
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="30">30</option>
                      <option value="50">50</option>
                    </select>
                  </div>
                </div>

                <!-- Indicador de carregamento -->
                <div
                  *ngIf="carregando"
                  class="d-flex justify-content-center my-4"
                >
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                  </div>
                </div>

                <!-- Tabela de transações -->
                <div
                  class="table-responsive"
                  *ngIf="
                    !carregando && transacoes && transacoes.content.length > 0
                  "
                >
                  <table class="table table-striped table-hover align-middle">
                    <thead class="table-light">
                      <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Sócio</th>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Cobranças</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let transacao of transacoes.content">
                        <td>
                          {{ transacao.dataVencimento | date : 'dd/MM/yyyy' }}
                        </td>
                        <td>{{ transacao.descricao }}</td>
                        <td>
                          <a href="#" (click)="darBaixa(transacao.id); $event.preventDefault();" class="text-primary text-decoration-underline" style="cursor: pointer;" *ngIf="transacao.socio">
                            {{ transacao.socio.nomeSocio }}
                          </a>
                          <span *ngIf="!transacao.socio">N/A</span>
                        </td>
                        <td>Crédito</td>
                        <td class="text-success">
                          {{ transacao.valor | currency : 'BRL' }}
                        </td>
                        <td>
                          <span
                            *ngFor="
                              let cobranca of transacao.listaDeCobrancaMensalidade;
                              let i = index
                            "
                          >
                            {{ cobranca.tipoCobranca }}:
                            {{ cobranca.valor | currency : 'BRL'
                            }}<span
                              *ngIf="
                                i <
                                (transacao.listaDeCobrancaMensalidade?.length ||
                                  0) -
                                  1
                              "
                              >,
                            </span>
                          </span>
                        </td>
                        <td>
                          <button
                            class="btn btn-sm btn-outline-primary me-1"
                            (click)="darBaixa(transacao.id)"
                          >
                            <i class="fas fa-check"></i> Dar Baixa
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Mensagem quando não há transações -->
                <div
                  class="alert alert-info text-center"
                  *ngIf="
                    !carregando &&
                    (!transacoes || transacoes.content.length === 0)
                  "
                >
                  Nenhuma transação de crédito encontrada para os filtros
                  selecionados.
                </div>

                <!-- Paginação -->
                <nav
                  aria-label="Navegação de páginas"
                  *ngIf="transacoes && transacoes.totalPages > 1"
                  class="mt-4"
                >
                  <ul class="pagination justify-content-center">
                    <li class="page-item" [class.disabled]="transacoes.first">
                      <a
                        class="page-link"
                        (click)="mudarPagina(transacoes.number - 1)"
                        [class.disabled]="transacoes.first"
                        [attr.aria-disabled]="transacoes.first"
                        >Anterior</a
                      >
                    </li>

                    <li
                      class="page-item"
                      *ngFor="
                        let pageNumber of getRange(getStartPage(), getEndPage())
                      "
                      [class.active]="pageNumber === transacoes?.number"
                    >
                      <a class="page-link" (click)="mudarPagina(pageNumber)">{{
                        pageNumber + 1
                      }}</a>
                    </li>

                    <li class="page-item" [class.disabled]="transacoes.last">
                      <a
                        class="page-link"
                        (click)="mudarPagina(transacoes.number + 1)"
                        [class.disabled]="transacoes.last"
                        [attr.aria-disabled]="transacoes.last"
                        >Próxima</a
                      >
                    </li>
                  </ul>
                </nav>

                <!-- Informações de paginação -->
                <div
                  class="d-flex justify-content-between align-items-center mt-2"
                  *ngIf="transacoes && transacoes.totalElements > 0"
                >
                  <small class="text-muted">
                    Mostrando {{ transacoes.numberOfElements }} de
                    {{ transacoes.totalElements }} transações
                  </small>
                  <small class="text-muted">
                    Página {{ transacoes.number + 1 }} de
                    {{ transacoes.totalPages }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TransacoesCreditoComponent implements OnInit {
  // Filtros
  mesFiltro: number = new Date().getMonth() + 1; // mês atual (Janeiro é 0, por isso +1)
  anoFiltro: number = new Date().getFullYear(); // ano atual
  pagina: number = 0;
  tamanhoPagina: number = 30;

  // Dados
  transacoes: TransacaoDetalhadaPage | null = null;
  carregando: boolean = false;

  constructor(
    private transacoesService: TransacoesOfxService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Ler os parâmetros da URL para definir mês e ano
    this.route.queryParams.subscribe((params) => {
      const anoParam = params['ano'] ? Number(params['ano']) : null;
      const mesParam = params['mes'] ? Number(params['mes']) : null;

      // Definir os valores dos filtros com base nos parâmetros, se fornecidos
      if (anoParam && anoParam >= 2020 && anoParam <= 2030) {
        this.anoFiltro = anoParam;
      } else {
        this.anoFiltro = new Date().getFullYear(); // ano atual como padrão
      }

      if (mesParam && mesParam >= 1 && mesParam <= 12) {
        this.mesFiltro = mesParam;
      } else {
        this.mesFiltro = new Date().getMonth() + 1; // mês atual como padrão (Janeiro é 0, por isso +1)
      }

      // Após definir os filtros, buscar as transações
      this.buscarTransacoes();
    });
  }

  buscarTransacoes(): void {
    this.carregando = true;

    this.transacoesService
      .getTransacoesDetalhadasPorMesAno(
        this.anoFiltro,
        this.mesFiltro,
        'CREDITO', // tipo ainda é passado para manter compatibilidade com interface
        this.pagina,
        this.tamanhoPagina
      )
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar transações:', error);

          // Verificar se é um erro de autorização (403)
          if (error.status === 403) {
            alert(
              'Acesso negado: você não tem permissão para visualizar transações. Verifique suas credenciais.'
            );
          } else if (error.status === 401) {
            alert('Sessão expirada: faça login novamente para continuar.');
          } else if (error.status === 0) {
            alert(
              'Erro de conexão: não foi possível se conectar ao servidor. Verifique se o backend está rodando.'
            );
          } else if (error.status === 404) {
            alert(
              'Endpoint não encontrado: verifique se o backend está configurado corretamente.'
            );
          } else {
            alert(
              error.error?.message ||
                'Erro ao buscar transações. Por favor, tente novamente.'
            );
          }

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
              paged: true, // Atualizado para refletir a estrutura correta
              unpaged: false,
            },
            sort: { empty: true, sorted: false, unsorted: true },
          } as TransacaoDetalhadaPage);
        })
      )
      .subscribe({
        next: (response) => {
          // Mapear os dados para garantir compatibilidade com o template
          const transacoesFiltradas = response.content
            .filter((transacao) => {
              return transacao.socio !== null; // Consideramos crédito se tiver sócio associado
            })
            .map((transacao) => {
              // Garantir que o campo 'data' esteja disponível para compatibilidade com templates antigos
              return {
                ...transacao,
                data: transacao.dataVencimento, // Mapeamento de dataVencimento para data
              };
            });

          // Criar nova resposta paginada com as transações filtradas e mapeadas
          this.transacoes = {
            ...response,
            content: transacoesFiltradas,
            totalElements: transacoesFiltradas.length,
            totalPages: Math.ceil(
              transacoesFiltradas.length / this.tamanhoPagina
            ),
            numberOfElements: transacoesFiltradas.length,
            empty: transacoesFiltradas.length === 0,
          };

          this.carregando = false;
        },
        error: (error) => {
          console.error('Erro ao buscar transações:', error);
          this.carregando = false;
        },
      });
  }

  mudarPagina(numeroPagina: number): void {
    if (
      numeroPagina >= 0 &&
      numeroPagina < (this.transacoes?.totalPages || 0)
    ) {
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
    return this.transacoes
      ? Math.min(this.transacoes.totalPages - 1, this.transacoes.number + 2)
      : 0;
  }

  darBaixa(transacaoId: number): void {
    // Navegar para a página de baixa de transação com o ID da transação
    this.router.navigate([
      '/pages/financeiro/transacoes/credito/baixar',
      transacaoId,
    ]);
  }

  adicionarCobranca(): void {
    // Navegar para a página de adição de cobrança
    this.router.navigate(['/financeiro/cobrancas/adicionar']);
  }
}
