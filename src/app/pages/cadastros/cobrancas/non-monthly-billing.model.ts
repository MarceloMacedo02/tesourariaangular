export interface Cobranca {
  id?: number;
  socioId: number;
  socioNome?: string;
  rubricaId?: number;      // New field for rubricas
  rubricaNome?: string;    // New field for rubricas
  valor: number;
  dataVencimento: string;  // Date format YYYY-MM-DD
  descricao: string;
  tipoCobranca: string;    // 'MENSALIDADE' | 'NAO_MENSALIDADE' | 'OUTRAS_RUBRICAS'
  status: string;          // 'PENDENTE' | 'PAGO' | 'CANCELADO' | 'ABERTA'
  dataRegistro?: string;   // Date format YYYY-MM-DD
  dataPagamento?: string;  // Date format YYYY-MM-DD
  observacoes?: string;
}

// Interface for batch billing requests
export interface BatchBillingRequest {
  sociosIds: number[];
  rubricaId: number;
  valor: number;
  dataVencimento: string;
  descricao?: string;
}

// Response for batch billing operations
export interface BatchBillingResponse {
  mensagem: string;
  cobrancasGeradas: number;
  cobrancasAtualizadas: number;
  sociosIgnorados: number;
  detalhes?: string[];
}