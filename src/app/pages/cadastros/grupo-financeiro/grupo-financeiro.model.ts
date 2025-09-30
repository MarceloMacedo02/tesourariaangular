export interface GrupoFinanceiro {
  id?: number;
  nomeGrupoFinanceiro: string;
  descricao?: string;
  centroCustoId: number;
  ativo: boolean;
  dataRegistro?: Date;
  dataAtualizacao?: Date;
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