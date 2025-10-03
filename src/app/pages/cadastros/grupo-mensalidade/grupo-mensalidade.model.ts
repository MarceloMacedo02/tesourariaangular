/**
 * Modelo de Grupo Mensalidade
 * Campos dataRegistro, dataAtualizacao e dataCriacao são de uso exclusivo do backend 
 * e não devem ser manipulados no frontend
 */
export interface GrupoMensalidade {
  id?: number;
  nomeGrupoMensalidade: string;      // Nome obrigatório do grupo de mensalidade
  descricao?: string;                 // Descrição opcional do grupo de mensalidade
  ativo: boolean;                     // Status de atividade do grupo
  dataRegistro?: string;              // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  dataAtualizacao?: string;           // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  itensRubricaMensalidade?: ItemRubricaMensalidade[]; // Lista de itens de rubrica do grupo
  dataCriacao?: string;               // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  valorTotal?: number;                // Campo calculado com a soma dos valores das rubricas (exibição apenas)
}

export interface ItemRubricaMensalidade {
  id?: number;
  rubricaId: number;                  // ID da rubrica associada
  grupoMensalidadeId?: number;        // ID do grupo de mensalidade (pode ser undefined ao criar novo grupo)
  valor: number;                      // Valor do item
  descricao?: string;                 // Descrição opcional do item
  ativo: boolean;                     // Status de atividade do item
  dataRegistro?: string;              // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  dataAtualizacao?: string;           // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
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

export interface Rubrica {
  id: number;
  nome: string; // Nome da rubrica
  valor: number; // Valor padrão da rubrica
  tipo: string; // Tipo da rubrica (RECEITA, DESPESA, etc.)
  descricao?: string; // Descrição opcional da rubrica
  dataCriacao?: string; // Campo de uso exclusivo do backend - ISO 8601 format: "2023-01-01T10:00:00"
  ativo: boolean; // Status de atividade da rubrica
  grupoFinanceiroId: number | undefined; // ID do grupo financeiro associado
  grupoFinanceiroNome?: string; // Nome do grupo financeiro para exibição
}