/**
 * Modelo de Sócio baseado no DTO do backend
 * Campos do backend adaptados para o modelo frontend
 */
export interface Socio {
  id?: number;                                    // ID do sócio
  nomeSocio: string;                             // Nome do sócio
  grau: string;                                  // Grau do sócio (TITULAR, SUPLENTE, etc.)
  diaNascimento?: number;                        // Dia de nascimento do sócio
  mesNascimento?: number;                        // Mês de nascimento do sócio
  dataNascimento?: string;                       // Data de nascimento do sócio
  cpf: string;                                   // CPF do sócio
  status?: string;                               // Status do sócio
  celular?: string;                              // Número de celular do sócio
  telefoneResidencial?: string;                  // Número de telefone residencial do sócio
  email?: string;                                // Email do sócio
  emailAlternativo?: string;                     // Email alternativo do sócio
  enderecoResidencial?: string;                  // Endereço residencial do sócio
  enderecoComercial?: string;                    // Endereço comercial do sócio
  enderecoOutro?: string;                        // Outro endereço do sócio
  dataAdesao?: string;                           // Data de adesão do sócio
  ativo?: boolean;                               // Indica se o sócio está ativo
  grupoMensalidadeId?: number;                   // ID do grupo de mensalidade do sócio
  dependentes?: SocioDependente[];               // Dependentes do sócio
  // Campos usados internamente no frontend
  imagemAvatar?: string;                         // Caminho da foto do sócio (usado para upload)
}

export interface SocioDependente {
  id?: number;                                   // ID do dependente
  nomeSocio: string;                             // Nome do dependente
  grau?: string;                                 // Grau do dependente (opcional ao enviar nome)
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

export interface GrupoMensalidade {
  id?: number;
  nomeGrupoMensalidade: string;
  descricao?: string;
  ativo: boolean;
}

export interface StatusSocio {
  // Enum de status de sócios
  name: string;
  descricao: string;
}

export interface GrauSocio {
  // Enum de graus de sócios
  name: string;
  descricao: string;
}

export interface SocioResumoDTO {
  id: number;
  nomeSocio: string;
}