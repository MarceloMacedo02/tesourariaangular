# Contas a Pagar e Receber

Esta documentação fornece os detalhes necessários para que o frontend consuma as APIs de contas a pagar e receber implementadas no backend.

## Índice

1. [Criação de Conta a Receber Avulsa](#criação-de-conta-a-receber-avulsa)
2. [Quitação de Conta a Receber](#quitação-de-conta-a-receber)
3. [Listagem de Cobranças](#listagem-de-cobranças)
4. [Criação de Conta a Pagar](#criação-de-conta-a-pagar)
5. [Quitação de Conta a Pagar](#quitação-de-conta-a-pagar)
6. [Listagem de Contas a Pagar](#listagem-de-contas-a-pagar)

## Criação de Conta a Receber Avulsa

### Endpoint

```
POST /api/cobrancas/salvar-avulsa
```

### Descrição

Cria uma nova cobrança avulsa que pode ser associada a um sócio, fornecedor ou cliente.

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body

```json
{
  "socioId": 123,
  "socioNome": "Nome do Sócio (opcional, apenas para referência)",
  "fornecedorId": 456,
  "fornecedorNome": "Nome do Fornecedor (opcional, apenas para referência)",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica (opcional, apenas para referência)",
  "descricao": "Descrição da cobrança",
  "valor": 100.0,
  "dataVencimento": "2025-12-31",
  "tipoCobranca": "AVULSA"
}
```

### Campos Obrigatórios

- `valor`: Valor da cobrança (maior que zero)
- `dataVencimento`: Data de vencimento no formato YYYY-MM-DD
- `tipoCobranca`: Deve ser "AVULSA"

### Campos Condicionais

- `socioId` ou `fornecedorId`: Pelo menos um deve ser informado
- Se `socioId` for informado, o valor de `fornecedorId` deve ser nulo
- Se `fornecedorId` for informado, o valor de `socioId` deve ser nulo

### Response (200 OK)

```json
{
  "id": 999,
  "socioId": 123,
  "socioNome": "Nome do Sócio",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica",
  "fornecedorId": null,
  "fornecedorNome": null,
  "grupoMensalidadeId": null,
  "grupoMensalidadeNome": null,
  "tipoCobranca": "AVULSA",
  "valorOriginal": 100.0,
  "valorPago": null,
  "dataVencimento": "2025-12-31",
  "dataPagamento": null,
  "status": "ABERTA",
  "descricao": "Descrição da cobrança",
  "dataRegistro": "2025-10-03T10:00:00"
}
```

### Erros Comuns

- `400 Bad Request`: Campos obrigatórios não preenchidos ou valores inválidos
- `401 Unauthorized`: Token de autorização inválido ou ausente
- `404 Not Found`: Sócio, fornecedor ou rubrica não encontrado

## Quitação de Conta a Receber

### Endpoint

```
POST /api/cobrancas/registrar-pagamento/{id}?contaFinanceiraId={contaFinanceiraId}
```

### Descrição

Registra o pagamento de uma cobrança, atualizando seu status para PAGA e criando uma movimentação financeira de entrada.

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Parâmetros de URL

- `id`: ID da cobrança a ser quitada
- `contaFinanceiraId`: ID da conta financeira onde o valor será depositado

### Response (200 OK)

```json
{
  "id": 999,
  "socioId": 123,
  "socioNome": "Nome do Sócio",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica",
  "fornecedorId": null,
  "fornecedorNome": null,
  "grupoMensalidadeId": null,
  "grupoMensalidadeNome": null,
  "tipoCobranca": "AVULSA",
  "valorOriginal": 100.0,
  "valorPago": 100.0,
  "dataVencimento": "2025-12-31",
  "dataPagamento": "2025-10-03",
  "status": "PAGA",
  "descricao": "Descrição da cobrança",
  "dataRegistro": "2025-10-03T10:00:00"
}
```

### Erros Comuns

- `400 Bad Request`: Cobrança já está paga ou cancelada
- `401 Unauthorized`: Token de autorização inválido ou ausente
- `404 Not Found`: Cobrança ou conta financeira não encontrada

## Listagem de Cobranças

### Endpoint

```
GET /api/cobrancas
```

### Descrição

Lista todas as cobranças cadastradas no sistema.

### Headers

```
Authorization: Bearer {token}
```

### Response (200 OK)

```json
[
  {
    "id": 999,
    "socioId": 123,
    "socioNome": "Nome do Sócio",
    "rubricaId": 789,
    "rubricaNome": "Nome da Rubrica",
    "fornecedorId": null,
    "fornecedorNome": null,
    "grupoMensalidadeId": null,
    "grupoMensalidadeNome": null,
    "tipoCobranca": "AVULSA",
    "valorOriginal": 100.0,
    "valorPago": 100.0,
    "dataVencimento": "2025-12-31",
    "dataPagamento": "2025-10-03",
    "status": "PAGA",
    "descricao": "Descrição da cobrança",
    "dataRegistro": "2025-10-03T10:00:00"
  }
]
```

### Filtros Adicionais

- `GET /api/cobrancas/status/{status}` - Filtra por status (ABERTA, PAGA, VENCIDA, CANCELADA, QUITADA)
- `GET /api/cobrancas/socio/{socioId}` - Filtra por sócio
- `GET /api/cobrancas/{id}` - Obtém cobrança específica por ID

## Criação de Conta a Pagar

### Endpoint

```
POST /api/contas-a-pagar/salvar
```

### Descrição

Cria uma nova conta a pagar.

### Headers

```
Content-Type: application/json
Authorization: Bearer {token}
```

### Request Body

```json
{
  "fornecedorId": 456,
  "fornecedorNome": "Nome do Fornecedor (opcional, apenas para referência)",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica (opcional, apenas para referência)",
  "descricao": "Descrição da conta a pagar",
  "valor": 500.0,
  "dataVencimento": "2025-12-31",
  "dataPagamento": null,
  "status": "ABERTA"
}
```

### Campos Obrigatórios

- `fornecedorId`: ID do fornecedor
- `rubricaId`: ID da rubrica
- `valor`: Valor da conta (maior que zero)
- `dataVencimento`: Data de vencimento no formato YYYY-MM-DD

### Response (200 OK)

```json
{
  "id": 101,
  "fornecedorId": 456,
  "fornecedorNome": "Nome do Fornecedor",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica",
  "descricao": "Descrição da conta a pagar",
  "valor": 500.0,
  "dataVencimento": "2025-12-31",
  "dataPagamento": null,
  "status": "ABERTA"
}
```

### Erros Comuns

- `400 Bad Request`: Campos obrigatórios não preenchidos ou valores inválidos
- `401 Unauthorized`: Token de autorização inválido ou ausente
- `404 Not Found`: Fornecedor ou rubrica não encontrado

## Quitação de Conta a Pagar

### Endpoint

```
POST /api/contas-a-pagar/registrar-pagamento/{id}?contaFinanceiraId={contaFinanceiraId}
```

### Descrição

Registra o pagamento de uma conta a pagar, atualizando seu status para PAGA e criando uma movimentação financeira de saída.

### Headers

```
Authorization: Bearer {token}
```

### Parâmetros de URL

- `id`: ID da conta a pagar a ser quitada
- `contaFinanceiraId`: ID da conta financeira de onde o valor será debitado

### Response (200 OK)

```json
{
  "id": 101,
  "fornecedorId": 456,
  "fornecedorNome": "Nome do Fornecedor",
  "rubricaId": 789,
  "rubricaNome": "Nome da Rubrica",
  "descricao": "Descrição da conta a pagar",
  "valor": 500.0,
  "dataVencimento": "2025-12-31",
  "dataPagamento": "2025-10-03",
  "status": "PAGA"
}
```

### Erros Comuns

- `400 Bad Request`: Conta a pagar já está paga ou cancelada
- `401 Unauthorized`: Token de autorização inválido ou ausente
- `404 Not Found`: Conta a pagar ou conta financeira não encontrada

## Listagem de Contas a Pagar

### Endpoint

```
GET /api/contas-a-pagar
```

### Descrição

Lista todas as contas a pagar cadastradas no sistema.

### Headers

```
Authorization: Bearer {token}
```

### Response (200 OK)

```json
[
  {
    "id": 101,
    "fornecedorId": 456,
    "fornecedorNome": "Nome do Fornecedor",
    "rubricaId": 789,
    "rubricaNome": "Nome da Rubrica",
    "descricao": "Descrição da conta a pagar",
    "valor": 500.0,
    "dataVencimento": "2025-12-31",
    "dataPagamento": "2025-10-03",
    "status": "PAGA"
  }
]
```

### Filtros Adicionais

- `GET /api/contas-a-pagar/{id}` - Obtém conta a pagar específica por ID

## Considerações Importantes

1. **Autenticação**: Todos os endpoints requerem um token de autorização válido.
2. **Validações**: O sistema faz validações de negócio antes de processar as requisições.
3. **Status das Cobranças**: Pode ser ABERTA, PAGA, VENCIDA, CANCELADA ou QUITADA.
4. **Status das Contas a Pagar**: Pode ser ABERTA, PAGA ou CANCELADA.
5. **Tipo de Cobrança**: Para contas avulsas, deve ser "AVULSA".

## Exemplo de Chamada com Axios (JavaScript)

```javascript
// Criação de conta a receber avulsa
const criarCobrancaAvulsa = async (dadosCobranca) => {
  try {
    const response = await axios.post("/api/cobrancas/salvar-avulsa", dadosCobranca, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cobrança avulsa:", error);
    throw error;
  }
};

// Quitação de cobrança
const quitarCobranca = async (idCobranca, idContaFinanceira) => {
  try {
    const response = await axios.post(
      `/api/cobrancas/registrar-pagamento/${idCobranca}?contaFinanceiraId=${idContaFinanceira}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao quitar cobrança:", error);
    throw error;
  }
};

// Criação de conta a pagar
const criarContaPagar = async (dadosContaPagar) => {
  try {
    const response = await axios.post("/api/contas-a-pagar/salvar", dadosContaPagar, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar conta a pagar:", error);
    throw error;
  }
};

// Quitação de conta a pagar
const quitarContaPagar = async (idContaPagar, idContaFinanceira) => {
  try {
    const response = await axios.post(
      `/api/contas-a-pagar/registrar-pagamento/${idContaPagar}?contaFinanceiraId=${idContaFinanceira}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao quitar conta a pagar:", error);
    throw error;
  }
};
```
