// Modelo genérico para transação detalhada que abrange ambas as estruturas
export interface TransacaoDetalhada {
  id: number;
  data?: string; // formato YYYY-MM-DD (convertido de dataVencimento)
  dataVencimento?: string; // formato YYYY-MM-DD
  dataPagamento?: string; // formato YYYY-MM-DD
  descricao: string;
  valor: number;
  tipo?: 'CREDITO' | 'DEBITO'; // opcional para permitir compatibilidade
  categoria?: string; // opcional
  status?: string | null;
  socio?: {
    id: number;
    nomeSocio: string;
  } | null;
  fornecedor?: {
    id: number;
    nome: string;
  };
  cobrancas?: CobrancaDetalhe[]; // opcional para compatibilidade
  listaDeCobrancaMensalidade?: any[];
  listaDeCobrancaOutrasRubricas?: any[];
  listaDeCobrancaAvulsa?: any[];
}

export interface CobrancaDetalhe {
  tipoCobranca: string;
  valor: number;
  quantidade: number;
}

// Modelo para a resposta paginada de transações detalhadas
export interface TransacaoDetalhadaPage {
  content: TransacaoDetalhada[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
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

// Modelo para a resposta paginada de transações detalhadas
export interface TransacaoDetalhadaPage {
  content: TransacaoDetalhada[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
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
