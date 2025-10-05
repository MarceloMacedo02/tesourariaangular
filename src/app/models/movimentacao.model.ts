// Modelo para movimentações financeiras (crédito/débito)

export interface Movimentacao {
  id?: number;
  descricao: string;
  valor: number;
  dataMovimento: string; // formato YYYY-MM-DD
  tipoMovimento: 'ENTRADA' | 'SAIDA';
  lancado: 'LANCADO' | 'NAOLANCADO';
  observacao?: string;
  rubricaId?: number;
  centroCustoId?: number;
  fornecedorId?: number | null;
  socioId?: number | null;
  categoriaId?: number;
  dataCriacao?: string; // formato ISO 8601
  dataAtualizacao?: string; // formato ISO 8601
  rubrica?: {
    id: number;
    descricao: string;
  };
  centroCusto?: {
    id: number;
    descricao: string;
  };
  socio?: {
    id: number;
    nomeSocio: string;
  };
  categoria?: {
    id: number;
    descricao: string;
  };
  fornecedor?: {
    id: number;
    nome: string;
  };
}

export interface MovimentacaoRequest {
  descricao: string;
  valor: number;
  dataMovimento: string; // formato YYYY-MM-DD
  tipoMovimento: 'ENTRADA' | 'SAIDA';
  lancado: 'LANCADO' | 'NAOLANCADO';
  observacao?: string;
  rubricaId?: number;
  centroCustoId?: number;
  fornecedorId?: number | null;
  socioId?: number | null;
  categoriaId?: number;
}

// Modelo para sócios (usado no ng-select)
export interface SocioSimples {
  id: number;
  nomeSocio: string;
}

// Modelo para cobranças de um sócio
export interface CobrancaSocio {
  id: number;
  descricao: string;
  valor: number;
  dataVencimento: string;
  status: string;
  rubricaId?: number;
  rubricaDescricao?: string;
  tipo: 'mensalidade' | 'rubrica';
}