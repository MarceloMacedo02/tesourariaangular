// Modelo para os dados de sócio
export interface Socio {
  id: number;
  nomeSocio: string;
}

// Modelo para os dados de fornecedor
export interface Fornecedor {
  id: number;
  nomeFornecedor: string;
  nome?: string; // para compatibilidade com outros componentes
}

// Modelo para cobranças de mensalidade
export interface CobrancaMensalidade {
  id: number;
  socioId: number | null;
  socioNome: string | null;
  rubricaId: number | null;
  rubricaNome: string | null;
  fornecedorId: number | null;
  fornecedorNome: string | null;
  grupoMensalidadeId: number | null;
  grupoMensalidadeNome: string | null;
  tipoCobranca: string;
  valorOriginal: number;
  valorPago: number;
  dataVencimento: string; // formato YYYY-MM-DD
  dataPagamento: string; // formato YYYY-MM-DD
  status: string; // ex: PAGO, PENDENTE
  descricao: string;
  dataRegistro: string; // formato ISO 8601
  valor: number;
  sociosIds: number[];
  pagador: string;
  nomeSocio: string;
  inicio: string; // formato YYYY-MM-DD
  fim: string; // formato YYYY-MM-DD
  dataPagamentoInicio: string; // formato YYYY-MM-DD
  dataPagamentoFim: string; // formato YYYY-MM-DD
  transacaoId: number;
}

// Modelo principal para transação detalhada conforme resposta da API
export interface TransacaoDetalhada {
  id: number;
  data?: string; // formato YYYY-MM-DD (para compatibilidade com outros componentes)
  dataVencimento: string; // formato YYYY-MM-DD
  dataPagamento: string; // formato YYYY-MM-DD
  descricao: string;
  valor: number;
  tipo?: 'CREDITO' | 'DEBITO'; // opcional para compatibilidade
  categoria?: string; // opcional para compatibilidade
  status: string; // ex: PAGO, PENDENTE
  socio: Socio | null;
  fornecedor: Fornecedor | null;
  tipoRelacionamento: string | null; // 'SOCIO', 'FORNECEDOR', etc.
  fornecedorOuSocio: string;
  cobrancas?: CobrancaDetalhe[]; // para compatibilidade com outros componentes
  listaDeCobrancaMensalidade: CobrancaMensalidade[];
  listaDeCobrancaOutrasRubricas: any[];
  listaDeCobrancaAvulsa: any[];
}

// Modelo para cobranças detalhadas (para compatibilidade)
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
