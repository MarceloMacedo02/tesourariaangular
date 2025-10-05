// Modelos para transações OFX

// Novos modelos conforme especificação modernizada
export interface OfxUploadRequest {
  file: File;
  accountId?: number;
}

export interface OfxUploadResponse {
  success: boolean;
  message: string;
  data: {
    transactionsCount: number;
    processedDate: string; // ISO date string
    accountId: number;
    transactions: OfxTransaction[];
  };
}

export interface OfxTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  type: 'debit' | 'credit';
}

// Modelos existentes mantidos para compatibilidade
export interface TransacaoDto {
  id: number;
  data: string; // formato YYYY-MM-DD
  tipo: 'CREDITO' | 'DEBITO';
  valor: number;
  fornecedorOuSocio: string;
  documento: string;
  descricao: string;
  lancado: 'LANCADO' | 'NAOLANCADO';
  tipoRelacionamento: 'SOCIO' | 'FORNECEDOR' | null;
  relacionadoId: number | null;
  manualSelectionNeeded: boolean;
}

export interface TransacaoPendente {
  id: number;
  data: string; // formato YYYY-MM-DD
  tipo: 'CREDITO' | 'DEBITO';
  valor: number;
  descricao: string;
  documento: string;
  fornecedorOuSocio: string;
  dataImportacao: string; // formato YYYY-MM-DD
  arquivoOrigem: string;
  processado: boolean;
}

export interface TransacaoProcessingResult {
  creditTransacoes: TransacaoDto[];
  debitTransacoes: TransacaoDto[];
  transacoesPendentes: TransacaoPendente[];
}

export interface ReferenciasFinanceiras {
  socios: { id: number; nome: string }[];
  fornecedores: { id: number; nome: string }[];
  rubricas: { id: number; nome: string }[];
}

// Interface para erro de API
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error: {
    code: string;
    details: string;
  };
}