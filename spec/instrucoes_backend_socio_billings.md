# Instruções para Implementação dos Endpoints do Backend - SocioBillingsComponent

## Visão Geral

Este documento fornece instruções detalhadas para a equipe de backend implementar os endpoints necessários para que o componente `SocioBillingsComponent` funcione corretamente no frontend. O componente permite visualizar todas as cobranças associadas a um sócio específico.

## Endpoints Necessários

### 1. Obter Informações do Sócio

**Método:** GET  
**Endpoint:** `/api/socios/{id}`  
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

#### Considerações de Implementação
- Certifique-se de que o endpoint já existe, pois é usado em outras partes do sistema
- O campo `grupoMensalidadeNome` deve ser incluído na resposta para exibição no frontend
- Todos os campos devem seguir o formato especificado

### 2. Obter Cobranças de um Sócio

**Método:** GET  
**Endpoint:** `/api/cobrancas/socio/{socioId}`  
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

#### Considerações de Implementação
- Este endpoint ainda não existe e precisa ser criado
- Deve retornar todas as cobranças associadas ao sócio especificado
- Os campos `socioNome` e `rubricaNome` devem ser incluídos para exibição no frontend
- O formato das datas deve ser `YYYY-MM-DD` (ex: "2023-05-15")
- O campo `valor` deve ser um número decimal (ex: 150.00)
- Os campos opcionais podem ser omitidos ou retornados como `null` quando não aplicáveis

## Estrutura de Dados

### Modelo Socio

Representa um sócio do sistema.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Integer | Sim | ID do sócio |
| nomeSocio | String | Sim | Nome completo do sócio |
| grau | String | Sim | Grau do sócio (TITULAR, SUPLENTE, etc.) |
| cpf | String | Sim | CPF do sócio |
| status | String | Não | Status do sócio |
| celular | String | Não | Número de celular |
| email | String | Não | Email principal |
| dataAdesao | String | Não | Data de adesão (formato YYYY-MM-DD) |
| ativo | Boolean | Não | Indica se o sócio está ativo |
| grupoMensalidadeId | Integer | Não | ID do grupo de mensalidade |
| grupoMensalidadeNome | String | Não | Nome do grupo de mensalidade |

### Modelo Cobranca

Representa uma cobrança associada a um sócio.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| id | Integer | Não | ID da cobrança |
| socioId | Integer | Sim | ID do sócio associado |
| socioNome | String | Não | Nome do sócio (para exibição) |
| rubricaId | Integer | Não | ID da rubrica associada |
| rubricaNome | String | Não | Nome da rubrica (para exibição) |
| valor | Decimal | Sim | Valor da cobrança |
| dataVencimento | String | Sim | Data de vencimento (formato YYYY-MM-DD) |
| descricao | String | Sim | Descrição da cobrança |
| tipoCobranca | String | Sim | Tipo da cobrança (MENSALIDADE, NAO_MENSALIDADE, OUTRAS_RUBRICAS) |
| status | String | Sim | Status da cobrança (PENDENTE, PAGO, CANCELADO, ABERTA) |
| dataRegistro | String | Não | Data de registro (formato YYYY-MM-DD) |
| dataPagamento | String | Não | Data de pagamento (formato YYYY-MM-DD) |
| observacoes | String | Não | Observações adicionais |

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

### Códigos de Erro Comuns

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

### Backend

1. **Endpoint `/api/cobrancas/socio/{socioId}`**:
   - Este é um novo endpoint que precisa ser criado
   - Deve retornar todas as cobranças associadas ao sócio especificado
   - Deve incluir os campos `socioNome` e `rubricaNome` para exibição no frontend
   - Deve seguir rigorosamente o formato de data `YYYY-MM-DD`
   - Deve garantir que apenas cobranças válidas sejam retornadas

2. **Endpoint `/api/socios/{id}`**:
   - Verifique se já existe e se retorna todos os campos necessários
   - Adicione o campo `grupoMensalidadeNome` se ainda não estiver presente
   - Mantenha a consistência com os outros endpoints do sistema

3. **Validações**:
   - Validar se o `socioId` é um número válido
   - Verificar se o sócio existe antes de retornar dados
   - Garantir que os dados retornados estejam no formato correto
   - Tratar adequadamente os casos em que campos opcionais são nulos

4. **Performance**:
   - Considere a implementação de paginação se houver muitas cobranças
   - Otimize as consultas ao banco de dados
   - Use cache apropriadamente para melhorar o desempenho

5. **Segurança**:
   - Garanta que apenas usuários autorizados possam acessar esses endpoints
   - Implemente as verificações de permissões apropriadas
   - Proteja contra ataques de injeção e outros vetores de ataque comuns

6. **Logging**:
   - Registre acessos importantes para auditoria
   - Logue erros de maneira apropriada para facilitar a depuração

### Integração com o Frontend

1. **Consistência de dados**:
   - Mantenha a estrutura de dados consistente com o que o frontend espera
   - Qualquer mudança na estrutura deve ser comunicada à equipe frontend

2. **Versionamento**:
   - Se houver mudanças significativas na API, considere versionar os endpoints
   - Mantenha compatibilidade com versões anteriores quando possível

3. **Documentação**:
   - Mantenha esta documentação atualizada com quaisquer mudanças
   - Forneça exemplos claros de requisições e respostas

## Critérios de Aceitação

1. O endpoint `/api/socios/{id}` retorna as informações do sócio no formato especificado
2. O endpoint `/api/cobrancas/socio/{socioId}` retorna todas as cobranças do sócio no formato especificado
3. Os campos `socioNome` e `rubricaNome` estão presentes nas respostas das cobranças
4. As datas estão no formato `YYYY-MM-DD`
5. Os valores decimais estão corretamente formatados
6. Os erros são tratados adequadamente e retornam mensagens claras
7. O acesso é restrito a usuários autorizados
8. O desempenho é aceitável mesmo com um número significativo de registros