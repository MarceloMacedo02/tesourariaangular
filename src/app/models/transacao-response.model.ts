export interface TransacaoResponse {
  content: TransacaoDto[];
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
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface TransacaoDto {
  id: number;
  data: string; // LocalDate as string
  tipo: TipoTransacao;
  valor: number; // BigDecimal as number
  fornecedorOuSocio: string;
  documento: string;
  descricao: string;
  lancado: Lancado;
  tipoRelacionamento: TipoRelacionamento;
  relacionadoId: number | null;
  fornecedorId: number | null;
  socioId: number | null;
  socioNome: string | null;
  statusIdentificacao: StatusIdentificacao;
  caminhoComprovante: string;
  // Fields from the original TransacaoDto model (may not be in API response but required for compatibility)
  manualSelectionNeeded?: boolean;
}

export type TipoTransacao = 'CREDITO' | 'DEBITO';
export type Lancado = 'LANCADO' | 'NAOLANCADO' | 'SIM' | 'NAO'; // Supports both formats for compatibility
export type TipoRelacionamento = 'SOCIO' | 'FORNECEDOR' | 'NAO_ENCONTRADO';
export type StatusIdentificacao = 'IDENTIFICADO' | 'PENDENTE_REVISAO' | 'NAO_ENCONTRADO';