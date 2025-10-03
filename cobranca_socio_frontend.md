# Frontend - Visualização de Cobranças de Sócio

Este documento detalha os endpoints e funcionalidades para a visualização de cobranças de sócios, separando entre cobranças quitadas e em aberto.

## Roteiro de Design

A interface de frontend permitirá que o usuário visualize as cobranças de um sócio específico. A visualização será dividida em duas seções:

1.  **Cobranças em Aberto**: Lista de cobranças que ainda não foram pagas.
2.  **Cobranças Quitadas**: Histórico de cobranças que já foram pagas.

O frontend deverá consumir os endpoints da API para buscar e exibir essas informações.

## Requisitos

### Funcionais

-   [x] Visualizar a lista de cobranças em aberto de um sócio.
-   [x] Visualizar a lista de cobranças quitadas de um sócio.
-   [ ] Permitir a busca de um sócio para visualizar suas cobranças.
-   [ ] Exibir detalhes de uma cobrança específica ao ser selecionada.

### Não-Funcionais

-   **Desempenho**: A API deve responder rapidamente às solicitações de listagem de cobranças.
-   **Segurança**: O acesso aos endpoints deve ser restrito a usuários autenticados e autorizados.

## Tarefas

-   [ ] **Frontend**: Implementar a tela de visualização de cobranças do sócio.
-   [ ] **Frontend**: Integrar a tela com os endpoints da API.
-   [ ] **Backend**: Garantir que os endpoints de cobrança estejam funcionando corretamente.

## Mapeamento de Funcionalidades Existentes

As seguintes funcionalidades já foram implementadas no backend e podem ser utilizadas para a construção da interface de frontend.

### Controllers

-   `CobrancaController.java`: Responsável por gerenciar as operações relacionadas a cobranças.
    -   `GET /api/cobrancas/socio/{socioId}`: Retorna todas as cobranças de um sócio.
    -   `GET /api/cobrancas/socio/{socioId}/abertas`: Retorna as cobranças em aberto de um sócio.
    -   `GET /api/cobrancas/socio/{socioId}/quitadas`: Retorna as cobranças quitadas de um sócio.

-   `SocioController.java`: Responsável por gerenciar as operações relacionadas a sócios.
    -   `GET /api/socios`: Retorna uma lista de todos os sócios.
    -   `GET /api/socios/{id}`: Retorna os detalhes de um sócio específico.

### DTOs

-   `CobrancaDTO.java`: Objeto de transferência de dados para cobranças.
-   `SocioDTO.java`: Objeto de transferência de dados para sócios.

## Endpoints para Visualização de Cobranças

### 1. Listar Cobranças em Aberto

-   **Endpoint**: `GET /api/cobrancas/socio/{socioId}/abertas`
-   **Descrição**: Retorna uma lista de todas as cobranças em aberto para um sócio específico.
-   **Exemplo de Resposta**:
    ```json
    [
        {
            "id": 1,
            "socioId": 1,
            "valor": 100.00,
            "dataVencimento": "2025-10-10",
            "status": "PENDENTE"
        }
    ]
    ```

### 2. Listar Cobranças Quitadas

-   **Endpoint**: `GET /api/cobrancas/socio/{socioId}/quitadas`
-   **Descrição**: Retorna uma lista de todas as cobranças quitadas para um sócio específico.
-   **Exemplo de Resposta**:
    ```json
    [
        {
            "id": 2,
            "socioId": 1,
            "valor": 150.00,
            "dataVencimento": "2025-09-10",
            "dataPagamento": "2025-09-08",
            "status": "PAGO"
        }
    ]
    ```

## Opção de Reversão

Para reverter a criação deste arquivo, execute o seguinte comando:

```bash
git rm E:/tesouraria/tesouraris_v2/spec/cobranca_socio_frontend.md
```
