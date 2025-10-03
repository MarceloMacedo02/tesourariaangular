/**
 * Modelo de Rubrica
 * Campos dataCriacao é de uso exclusivo do backend e não deve ser manipulado no frontend
 */
export interface Rubrica {
  id?: number;
  valor: number; // Valor padrão da rubrica
  nome: string; // Nome obrigatório da rubrica (máximo 100 caracteres)
  tipo: string; // Tipo da rubrica (RECEITA, DESPESA, etc.)
  descricao?: string; // Descrição opcional da rubrica
  dataCriacao?: string; // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  ativo: boolean; // Status de atividade da rubrica
  grupoFinanceiroId: number | undefined; // ID do grupo financeiro associado (pode ser undefined quando não selecionado no formulário)
  grupoFinanceiroNome?: string; // Nome do grupo financeiro para exibição
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