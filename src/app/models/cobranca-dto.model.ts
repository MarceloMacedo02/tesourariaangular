export interface CobrancaDTO {
  id: number | null;
  socioId: number | null;
  socioNome: string;
  rubricaId: number | null;
  rubricaNome: string;
  fornecedorId: number | null;
  fornecedorNome: string;
  grupoMensalidadeId: number | null;
  grupoMensalidadeNome: string;
  tipoCobranca: 'OUTRAS_RUBRICAS' | 'AVULSA' | 'MENSALIDADE';
  valorOriginal: number;
  valorPago: number;
  dataVencimento: string | null; // formato YYYY-MM-DD
  dataPagamento: string | null; // formato YYYY-MM-DD
  status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
  descricao: string;
  dataRegistro: string | null; // formato YYYY-MM-DDTHH:mm:ss
  valor: number;
  sociosIds: number[];
  pagador: string;
  nomeSocio: string;
  inicio: string | null; // formato YYYY-MM-DD
  fim: string | null; // formato YYYY-MM-DD
  dataPagamentoInicio: string | null; // formato YYYY-MM-DD
  dataPagamentoFim: string | null; // formato YYYY-MM-DD
  transacaoId: number | null;
  mesLancamento?: number;
  anoLancamento?: number;
  socio?: any; // Referência para o sócio
}