/**
 * Modelo de Grupo Financeiro
 * Campos dataRegistro e dataAtualizacao são de uso exclusivo do backend e não devem ser manipulados no frontend
 */
export interface GrupoFinanceiro {
  id?: number;
  nomeGrupoFinanceiro: string;
  descricao?: string;
  centroCustoId: number | undefined; // Pode ser undefined quando não selecionado no formulário
  ativo: boolean;
  dataRegistro?: string; // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  dataAtualizacao?: string; // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  centroCustoNome?: string; // Nome do centro de custo, retornado pelo backend para exibição na tabela
  centroCusto?: any; // The centro de custo object that may be loaded separately
}

export interface Page<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  empty: boolean;
}