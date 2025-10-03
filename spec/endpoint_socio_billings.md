# Endpoint e Estrutura de Dados para SocioBillingsComponent

## Visão Geral

Este documento descreve os endpoints da API e a estrutura de dados necessária para que o componente `SocioBillingsComponent` funcione corretamente, permitindo visualizar todas as cobranças associadas a um sócio específico.

## Endpoints Necessários

### 1. Obter Informações do Sócio

**Método:** GET  
**Endpoint:** `/api/socios/{id}`  
**Serviço Frontend:** `SocioService.getSocioById(id: number)`  
**Descrição:** Obtém as informações detalhadas de um sócio específico

#### Parâmetros
- `id` (path): ID do sócio

#### Resposta de Sucesso (200 OK)
```json
{
  "id": 123,
  "nomeSocio": "João Silva",
  "grau": "TITULAR",
  "cpf": "123.456.789-00",
  "status": "ATIVO",
  "celular": "(11) 99999-9999",
  "email": "joao.silva@email.com",
  "dataAdesao": "2020-01-15",
  "ativo": true,
  "grupoMensalidadeId": 5,
  "grupoMensalidadeNome": "Grupo Padrão"
}
```

### 2. Obter Cobranças de um Sócio

**Método:** GET  
**Endpoint:** `/api/cobrancas/socio/{socioId}`  
**Serviço Frontend:** `NonMonthlyBillingService.getBillingsBySocioId(socioId: number)`  
**Descrição:** Obtém todas as cobranças associadas a um sócio específico

#### Parâmetros
- `socioId` (path): ID do sócio

#### Resposta de Sucesso (200 OK)
```json
[
  {
    "id": 456,
    "socioId": 123,
    "socioNome": "João Silva",
    "rubricaId": 7,
    "rubricaNome": "Taxa de Adesão",
    "valor": 150.00,
    "dataVencimento": "2023-05-15",
    "descricao": "Taxa de adesão anual",
    "tipoCobranca": "OUTRAS_RUBRICAS",
    "status": "PAGO",
    "dataRegistro": "2023-04-01",
    "dataPagamento": "2023-04-10",
    "observacoes": "Pagamento realizado via boleto bancário"
  },
  {
    "id": 789,
    "socioId": 123,
    "socioNome": "João Silva",
    "rubricaId": 3,
    "rubricaNome": "Mensalidade Básica",
    "valor": 85.50,
    "dataVencimento": "2023-06-10",
    "descricao": "Mensalidade referente a maio/2023",
    "tipoCobranca": "MENSALIDADE",
    "status": "ABERTA",
    "dataRegistro": "2023-05-01",
    "observacoes": ""
  }
]
```

## Estrutura de Dados

### Modelo Socio

Representa um sócio do sistema.

```typescript
interface Socio {
  id?: number;                                    // ID do sócio
  nomeSocio: string;                             // Nome do sócio
  grau: string;                                  // Grau do sócio (TITULAR, SUPLENTE, etc.)
  diaNascimento?: number;                        // Dia de nascimento do sócio
  mesNascimento?: number;                        // Mês de nascimento do sócio
  dataNascimento?: string;                       // Data de nascimento do sócio (YYYY-MM-DD)
  cpf: string;                                   // CPF do sócio
  status?: string;                               // Status do sócio
  celular?: string;                              // Número de celular do sócio
  telefoneResidencial?: string;                  // Número de telefone residencial do sócio
  email?: string;                                // Email do sócio
  emailAlternativo?: string;                     // Email alternativo do sócio
  enderecoResidencial?: string;                  // Endereço residencial do sócio
  enderecoComercial?: string;                    // Endereço comercial do sócio
  enderecoOutro?: string;                        // Outro endereço do sócio
  dataAdesao?: string;                           // Data de adesão do sócio (YYYY-MM-DD)
  ativo?: boolean;                               // Indica se o sócio está ativo
  grupoMensalidadeId?: number;                   // ID do grupo de mensalidade do sócio
  dependentes?: SocioDependente[];               // Dependentes do sócio
  imagemAvatar?: string;                         // Caminho da foto do sócio (usado para upload)
}
```

### Modelo Cobranca

Representa uma cobrança associada a um sócio.

```typescript
interface Cobranca {
  id?: number;                                   // ID da cobrança
  socioId: number;                               // ID do sócio associado
  socioNome?: string;                            // Nome do sócio (para exibição)
  rubricaId?: number;                            // ID da rubrica associada
  rubricaNome?: string;                          // Nome da rubrica (para exibição)
  valor: number;                                 // Valor da cobrança
  dataVencimento: string;                       // Data de vencimento (YYYY-MM-DD)
  descricao: string;                             // Descrição da cobrança
  tipoCobranca: string;                          // Tipo da cobrança (MENSALIDADE | NAO_MENSALIDADE | OUTRAS_RUBRICAS)
  status: string;                                // Status da cobrança (PENDENTE | PAGO | CANCELADO | ABERTA)
  dataRegistro?: string;                         // Data de registro (YYYY-MM-DD)
  dataPagamento?: string;                        // Data de pagamento (YYYY-MM-DD)
  observacoes?: string;                         // Observações adicionais
}
```

## Enums

### TipoCobranca

Valores possíveis para o campo `tipoCobranca`:

- `MENSALIDADE`: Cobrança de mensalidade
- `NAO_MENSALIDADE`: Cobrança não mensal
- `OUTRAS_RUBRICAS`: Cobrança de outras rubricas

### StatusCobranca

Valores possíveis para o campo `status`:

- `PENDENTE`: Cobrança pendente de pagamento
- `PAGO`: Cobrança paga
- `CANCELADO`: Cobrança cancelada
- `ABERTA`: Cobrança em aberto

## Requisições de Exemplo

### Obter informações do sócio

```bash
curl -X GET \
  http://localhost:8080/api/socios/123 \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json'
```

### Obter cobranças do sócio

```bash
curl -X GET \
  http://localhost:8080/api/cobrancas/socio/123 \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json'
```

## Tratamento de Erros

### Erros Comuns

1. **404 Not Found**: Sócio ou cobrança não encontrada
2. **401 Unauthorized**: Token de autenticação inválido ou ausente
3. **500 Internal Server Error**: Erro interno no servidor

### Estrutura Padrão de Erro

```json
{
  "timestamp": "2023-05-15T10:30:00.000+00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Sócio não encontrado com ID: 123",
  "path": "/api/socios/123"
}
```

## Considerações de Implementação

### Frontend

1. O componente `SocioBillingsComponent` carrega simultaneamente as informações do sócio e suas cobranças
2. Enquanto os dados estão sendo carregados, é exibido um spinner de loading
3. Em caso de erro, é exibida uma mensagem amigável ao usuário
4. Os valores monetários são formatados como moeda brasileira (R$)
5. As datas são formatadas no padrão dd/mm/yyyy
6. O status das cobranças é exibido com badges coloridos para melhor visualização

### Backend

1. O endpoint `/api/cobrancas/socio/{socioId}` deve retornar todas as cobranças associadas ao sócio
2. As informações do sócio devem incluir o nome para exibição
3. As informações das rubricas devem incluir o nome para exibição
4. Todos os campos devem seguir o formato especificado (datas como strings YYYY-MM-DD)
5. O backend deve garantir que apenas cobranças válidas sejam retornadas