/**
 * Modelos para Contas a Pagar e Receber
 */

export interface CobrancaAvulsa {
  id?: number;
  socioId?: number;
  socioNome?: string;
  fornecedorId?: number;
  fornecedorNome?: string;
  rubricaId: number;
  rubricaNome?: string;
  grupoMensalidadeId?: number;
  grupoMensalidadeNome?: string;
  tipoCobranca: 'AVULSA';
  valorOriginal: number;
  valorPago?: number;
  dataVencimento: string; // Formato: YYYY-MM-DD
  dataPagamento?: string; // Formato: YYYY-MM-DD
  status: 'ABERTA' | 'PAGA' | 'VENCIDA' | 'CANCELADA' | 'QUITADA';
  descricao: string;
  dataRegistro?: string; // Preenchido automaticamente pelo backend
  dataAtualizacao?: string; // Preenchido automaticamente pelo backend
}

export interface ContaPagar {
  id?: number;
  fornecedorId: number;
  fornecedorNome?: string;
  rubricaId: number;
  rubricaNome?: string;
  descricao: string;
  valor: number;
  dataVencimento: string; // Formato: YYYY-MM-DD
  dataPagamento?: string; // Formato: YYYY-MM-DD
  status: 'ABERTA' | 'PAGA' | 'CANCELADA';
  dataRegistro?: string; // Preenchido automaticamente pelo backend
  dataAtualizacao?: string; // Preenchido automaticamente pelo backend
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

export interface Socio {
  id: number;
  nomeSocio: string;
}

export interface Fornecedor {
  id: number;
  nomeFantasia: string;
}

export interface Rubrica {
  id: number;
  nome: string;
}

export interface GrupoMensalidade {
  id: number;
  nomeGrupoMensalidade: string;
}

export interface ContaFinanceira {
  id: number;
  nomeConta: string;
}