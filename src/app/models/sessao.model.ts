export interface Sessao {
  id: number;
  usuario: string;
  dataLogin: string;
  duracaoSessao?: number;
  ativo?: boolean;
}