// Modelos para transações OFX

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