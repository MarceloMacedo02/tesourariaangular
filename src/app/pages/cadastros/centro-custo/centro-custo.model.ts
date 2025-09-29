export interface CentroCusto {
  id?: number;
  nomeCentroCusto: string;
  descricao?: string;
  saldoCredito?: number; // BigDecimal in backend
  saldoDespesa?: number; // BigDecimal in backend
  saldoResultado?: number; // BigDecimal in backend
  dataRegistro?: string; // ISO string format
  ativo: boolean;
  dataAtualizacao?: string; // ISO string format
}

export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
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