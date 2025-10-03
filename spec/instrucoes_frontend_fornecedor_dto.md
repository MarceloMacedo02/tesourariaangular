# Instruções para Utilização do Controller de Fornecedor com DTOs

## Visão Geral

Este documento fornece instruções detalhadas para o frontend sobre como utilizar o controller de Fornecedor com DTOs (Data Transfer Objects) em vez de entidades diretas. Esta abordagem oferece benefícios como maior segurança, controle sobre os dados transferidos e melhor desempenho.

## Estrutura do DTO de Fornecedor

### FornecedorDTO

```json
{
  "id": 1, // Opcional para criação, obrigatório para atualização
  "nomeFantasia": "Tech Solutions", // Obrigatório, máximo 100 caracteres
  "razaoSocial": "Tech Solutions Ltda.", // Opcional, máximo 150 caracteres
  "cpfCnpj": "12.345.678/0001-90", // Obrigatório, máximo 18 caracteres
  "rg": "12.345.678-9", // Opcional, máximo 20 caracteres
  "endereco": "Rua Exemplo, 123, Cidade, Estado", // Opcional, máximo 200 caracteres
  "telefone": "(11) 98765-4321", // Opcional, máximo 15 caracteres
  "email": "contato@techsolutions.com", // Opcional, formato de email válido, máximo 100 caracteres
  "inscricaoEstadual": "123.456.789.112", // Opcional, máximo 20 caracteres
  "observacoes": "Fornecedor de serviços de TI.", // Opcional, máximo 500 caracteres
  "ativo": true, // Opcional, padrão true
  "dataRegistro": "2023-01-01T10:00:00", // Preenchido automaticamente pelo backend
  "dataAtualizacao": "2023-01-01T10:00:00" // Preenchido automaticamente pelo backend
}
```

## Endpoints Disponíveis

### 1. Listar Fornecedores

**Método:** GET  
**Endpoint:** `/api/fornecedores`  
**Descrição:** Retorna uma lista paginada de fornecedores

#### Parâmetros de Query

- `page`: Número da página (padrão: 0)
- `size`: Tamanho da página (padrão: 10)
- `filtro`: Filtro de busca (padrão: "")

#### Resposta de Sucesso (200 OK)

```json
{
  "content": [
    {
      "id": 1,
      "nomeFantasia": "Tech Solutions",
      "razaoSocial": "Tech Solutions Ltda.",
      "cpfCnpj": "12.345.678/0001-90",
      "rg": "12.345.678-9",
      "endereco": "Rua Exemplo, 123, Cidade, Estado",
      "telefone": "(11) 98765-4321",
      "email": "contato@techsolutions.com",
      "inscricaoEstadual": "123.456.789.112",
      "observacoes": "Fornecedor de serviços de TI.",
      "ativo": true,
      "dataRegistro": "2023-01-01T10:00:00",
      "dataAtualizacao": "2023-01-01T10:00:00"
    }
  ],
  "pageable": {
    "sort": {
      "empty": false,
      "sorted": true,
      "unsorted": false
    },
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 30,
    "unpaged": false
  },
  "totalElements": 1,
  "totalPages": 1,
  "last": true,
  "first": true,
  "number": 0,
  "size": 10,
  "numberOfElements": 1,
  "empty": false
}
```

### 2. Buscar Fornecedor por ID

**Método:** GET  
**Endpoint:** `/api/fornecedores/{id}`  
**Descrição:** Retorna um fornecedor específico com base no ID fornecido

#### Parâmetros de Path

- `id`: ID do fornecedor

#### Resposta de Sucesso (200 OK)

```json
{
  "id": 1,
  "nomeFantasia": "Tech Solutions",
  "razaoSocial": "Tech Solutions Ltda.",
  "cpfCnpj": "12.345.678/0001-90",
  "rg": "12.345.678-9",
  "endereco": "Rua Exemplo, 123, Cidade, Estado",
  "telefone": "(11) 98765-4321",
  "email": "contato@techsolutions.com",
  "inscricaoEstadual": "123.456.789.112",
  "observacoes": "Fornecedor de serviços de TI.",
  "ativo": true,
  "dataRegistro": "2023-01-01T10:00:00",
  "dataAtualizacao": "2023-01-01T10:00:00"
}
```

### 3. Criar Novo Fornecedor

**Método:** POST  
**Endpoint:** `/api/fornecedores`  
**Descrição:** Cria um novo fornecedor com os dados fornecidos

#### Corpo da Requisição

```json
{
  "nomeFantasia": "Novo Fornecedor",
  "razaoSocial": "Novo Fornecedor Ltda.",
  "cpfCnpj": "98.765.432/0001-10",
  "endereco": "Nova Rua, 456, Cidade, Estado",
  "telefone": "(11) 12345-6789",
  "email": "contato@novofornecedor.com",
  "ativo": true,
  "observacoes": "Novo fornecedor de equipamentos."
}
```

#### Resposta de Sucesso (201 Created)

```json
{
  "id": 2,
  "nomeFantasia": "Novo Fornecedor",
  "razaoSocial": "Novo Fornecedor Ltda.",
  "cpfCnpj": "98.765.432/0001-10",
  "rg": null,
  "endereco": "Nova Rua, 456, Cidade, Estado",
  "telefone": "(11) 12345-6789",
  "email": "contato@novofornecedor.com",
  "inscricaoEstadual": null,
  "observacoes": "Novo fornecedor de equipamentos.",
  "ativo": true,
  "dataRegistro": "2023-10-03T14:30:00",
  "dataAtualizacao": "2023-10-03T14:30:00"
}
```

### 4. Atualizar Fornecedor Existente

**Método:** PUT  
**Endpoint:** `/api/fornecedores/{id}`  
**Descrição:** Atualiza os dados de um fornecedor existente com base no ID

#### Parâmetros de Path

- `id`: ID do fornecedor a ser atualizado

#### Corpo da Requisição

```json
{
  "id": 1,
  "nomeFantasia": "Tech Solutions Atualizado",
  "razaoSocial": "Tech Solutions Ltda.",
  "cpfCnpj": "12.345.678/0001-90",
  "endereco": "Rua Exemplo, 123, Cidade, Estado",
  "telefone": "(11) 98765-4321",
  "email": "contato@techsolutions.com",
  "ativo": false,
  "observacoes": "Fornecedor atualizado com novas informações."
}
```

#### Resposta de Sucesso (200 OK)

```json
{
  "id": 1,
  "nomeFantasia": "Tech Solutions Atualizado",
  "razaoSocial": "Tech Solutions Ltda.",
  "cpfCnpj": "12.345.678/0001-90",
  "rg": "12.345.678-9",
  "endereco": "Rua Exemplo, 123, Cidade, Estado",
  "telefone": "(11) 98765-4321",
  "email": "contato@techsolutions.com",
  "inscricaoEstadual": "123.456.789.112",
  "observacoes": "Fornecedor atualizado com novas informações.",
  "ativo": false,
  "dataRegistro": "2023-01-01T10:00:00",
  "dataAtualizacao": "2023-10-03T14:35:00"
}
```

### 5. Excluir Fornecedor

**Método:** DELETE  
**Endpoint:** `/api/fornecedores/{id}`  
**Descrição:** Exclui um fornecedor existente com base no ID

#### Parâmetros de Path

- `id`: ID do fornecedor a ser excluído

#### Resposta de Sucesso (204 No Content)

- Retorna status 204 sem conteúdo quando a exclusão é bem-sucedida

## Exemplos de Código Frontend

### Serviço de Fornecedor

```javascript
class FornecedorService {
  // Listar fornecedores com paginação e filtro
  static async listarFornecedores(page = 0, size = 10, filtro = "") {
    try {
      const params = new URLSearchParams({
        page,
        size,
        filtro,
      });

      const response = await fetch(`/api/fornecedores?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao listar fornecedores: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao listar fornecedores:", error);
      throw error;
    }
  }

  // Buscar fornecedor por ID
  static async buscarFornecedorPorId(id) {
    try {
      if (!id || typeof id !== "number" || id <= 0) {
        throw new Error("ID do fornecedor é obrigatório e deve ser um número positivo");
      }

      const response = await fetch(`/api/fornecedores/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null; // Fornecedor não encontrado
      }

      if (!response.ok) {
        throw new Error(`Erro ao buscar fornecedor: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao buscar fornecedor:", error);
      throw error;
    }
  }

  // Criar novo fornecedor
  static async criarFornecedor(fornecedorDTO) {
    try {
      // Validações frontend
      if (!fornecedorDTO.nomeFantasia) {
        throw new Error("Nome fantasia é obrigatório");
      }

      if (!fornecedorDTO.cpfCnpj) {
        throw new Error("CPF/CNPJ é obrigatório");
      }

      const response = await fetch("/api/fornecedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedorDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar fornecedor: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar fornecedor:", error);
      throw error;
    }
  }

  // Atualizar fornecedor existente
  static async atualizarFornecedor(id, fornecedorDTO) {
    try {
      // Validações frontend
      if (!id || typeof id !== "number" || id <= 0) {
        throw new Error("ID do fornecedor é obrigatório e deve ser um número positivo");
      }

      if (!fornecedorDTO.nomeFantasia) {
        throw new Error("Nome fantasia é obrigatório");
      }

      const response = await fetch(`/api/fornecedores/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fornecedorDTO),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao atualizar fornecedor: ${response.status} - ${errorData.message || "Erro desconhecido"}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar fornecedor:", error);
      throw error;
    }
  }

  // Excluir fornecedor
  static async excluirFornecedor(id) {
    try {
      if (!id || typeof id !== "number" || id <= 0) {
        throw new Error("ID do fornecedor é obrigatório e deve ser um número positivo");
      }

      const response = await fetch(`/api/fornecedores/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao excluir fornecedor: ${response.status}`);
      }

      // Retorna true para indicar sucesso na exclusão
      return true;
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      throw error;
    }
  }
}
```

## Validações Frontend Recomendadas

### 1. Validações Obrigatórias

- `nomeFantasia`: Campo obrigatório, máximo 100 caracteres
- `cpfCnpj`: Campo obrigatório, máximo 18 caracteres
- `id` (para atualização/exclusão): Deve ser um número positivo

### 2. Validações Opcionais

- `email`: Deve seguir formato de email válido
- `telefone`: Formato opcional, máximo 15 caracteres
- `endereco`: Máximo 200 caracteres
- `observacoes`: Máximo 500 caracteres

## Tratamento de Erros

### Códigos de Resposta Comuns

- **200 OK**: Operação bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação bem-sucedida, sem conteúdo retornado
- **400 Bad Request**: Dados inválidos ou malformados
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno no servidor

### Recomendações de Tratamento

- Implementar tratamento adequado de erros para apresentar mensagens amigáveis ao usuário
- Validar dados no frontend para melhor experiência do usuário
- Usar loading indicators durante operações assíncronas
- Implementar confirmação para operações de exclusão

## Observações Importantes

1. **Campos Automáticos**: Os campos `dataRegistro` e `dataAtualizacao` são preenchidos automaticamente pelo backend e não devem ser definidos no frontend.

2. **Segurança**: Usar DTOs em vez de entidades diretamente protege contra exposição de dados sensíveis e campos que não devem ser modificados diretamente.

3. **Validações**: As validações definidas no DTO são aplicadas automaticamente pelo backend, mas é recomendado também validar no frontend para melhor experiência do usuário.

4. **Campos Opcionais**: Campos não obrigatórios podem ser nulos ou omitidos na requisição.

O controller de fornecedor agora está configurado para usar DTOs, seguindo as melhores práticas de arquitetura de software e segurança.
