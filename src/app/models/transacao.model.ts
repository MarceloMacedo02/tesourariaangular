// Modelo para transações genéricas baseado na API

export interface Transacao {
  id: number;
  data: string; // formato YYYY-MM-DD
  valor: number;
  relacionadoId: number;
  descricao: string;
  documento: string;
  fornecedorOuSocio: string;
  lancado: 'LANCADO' | 'NAOLANCADO';
  tipo: 'CREDITO' | 'DEBITO';
  tipoRelacionamento: 'SOCIO' | 'FORNECEDOR' | 'NAO_ENCONTRADO';
  statusIdentificacao: 'IDENTIFICADO' | 'PENDENTE_REVISAO' | 'NAO_ENCONTRADO';
  dataCriacao: string; // formato ISO 8601
  ativo: boolean;
}

export interface TransacaoFilterParams {
  ano: number;
  mes: number;
}