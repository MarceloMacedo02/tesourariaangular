/**
 * Modelo de Fornecedor baseado no DTO do backend
 * Campos do backend adaptados para o modelo frontend
 */
export interface Fornecedor {
  id?: number;                                    // ID do fornecedor (opcional para criação, obrigatório para atualização)
  nomeFantasia: string;                          // Nome fantasia do fornecedor (obrigatório, máximo 100 caracteres)
  razaoSocial?: string;                          // Razão social do fornecedor (opcional, máximo 150 caracteres)
  cpfCnpj: string;                               // CPF ou CNPJ do fornecedor (obrigatório, máximo 18 caracteres)
  rg?: string;                                   // RG do fornecedor (opcional, máximo 20 caracteres)
  endereco?: string;                             // Endereço do fornecedor (opcional, máximo 200 caracteres)
  telefone?: string;                             // Telefone do fornecedor (opcional, máximo 15 caracteres)
  email?: string;                                // Email do fornecedor (opcional, formato de email válido, máximo 100 caracteres)
  inscricaoEstadual?: string;                    // Inscrição estadual do fornecedor (opcional, máximo 20 caracteres)
  observacoes?: string;                          // Observações sobre o fornecedor (opcional, máximo 500 caracteres)
  ativo?: boolean;                               // Indica se o fornecedor está ativo (opcional, padrão true)
  dataRegistro?: string;                         // Data de registro do fornecedor (preenchido automaticamente pelo backend)
  dataAtualizacao?: string;                      // Data de atualização do fornecedor (preenchido automaticamente pelo backend)
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