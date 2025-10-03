export interface Fornecedor {
  id?: number; // Opcional para criação, obrigatório para atualização
  nomeFantasia: string; // Obrigatório, máximo 100 caracteres
  razaoSocial?: string; // Opcional, máximo 150 caracteres
  cpfCnpj: string; // Obrigatório, máximo 18 caracteres
  rg?: string; // Opcional, máximo 20 caracteres
  endereco?: string; // Opcional, máximo 200 caracteres
  telefone?: string; // Opcional, máximo 15 caracteres
  email?: string; // Opcional, formato de email válido, máximo 100 caracteres
  inscricaoEstadual?: string; // Opcional, máximo 20 caracteres
  observacoes?: string; // Opcional, máximo 500 caracteres
  ativo?: boolean; // Opcional, padrão true
  dataRegistro?: string; // Preenchido automaticamente pelo backend
  dataAtualizacao?: string; // Preenchido automaticamente pelo backend
}

export interface FornecedorPage {
  content: Fornecedor[];
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
  numberOfElements: number;
  empty: boolean;
}