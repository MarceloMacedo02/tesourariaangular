# Review Transacoes Component

## Roteiro de Design

Implementar funcionalidade para visualizar transações de acordo com o endpoint real `/api/transacoes/por-mes-ano`. O componente permitirá aos usuários filtrar transações por ano e mês, com paginação, e exibir os resultados com todas as propriedades especificadas na resposta da API.

### Componentes envolvidos:
1. Service para comunicação com a API
2. Componente Angular para interface de review de transações
3. Modelo para representar a resposta da API

### Arquitetura proposta:
- Atualizar o modelo TransacaoResponse para refletir a estrutura real da API
- Atualizar o service TransacoesOfxService para consumir o endpoint real
- Atualizar o componente ReviewTransacoes para usar a nova estrutura de dados

## Requisitos

### Requisitos Funcionais:
1. O componente deve chamar o endpoint GET `/api/transacoes/por-mes-ano` com os parâmetros ano, mes, page e size
2. Exibir a lista de transações retornadas conforme a estrutura definida
3. Implementar paginação correta com base na resposta da API
4. Exibir informações detalhadas conforme especificado (socioId, statusIdentificacao, etc.)

### Requisitos Não-Funcionais:
1. Tratamento adequado de erros
2. Feedback visual durante o carregamento
3. Validação dos filtros obrigatórios (ano e mês)
4. Uso da URL base da API configurada no ambiente

### Critérios de Aceitação:
1. O endpoint deve ser chamado com sucesso e retornar os dados corretos
2. A resposta da API deve ser corretamente mapeada e exibida
3. A paginação deve funcionar conforme os metadados retornados pela API
4. A interface deve fornecer feedback adequado durante o processo

## Tarefas

- [x] Criar arquivo de especificação em spec/review-transacoes-component.md
- [ ] Atualizar modelo TransacaoResponse para refletir a estrutura da API
- [ ] Atualizar service para consumir o endpoint real
- [ ] Atualizar componente ReviewTransacoes para usar a nova estrutura
- [ ] Testar funcionalidade com o endpoint real

## Opção de Reversão

Para desfazer as alterações:
1. Excluir o arquivo spec/review-transacoes-component.md
2. Reverter as alterações no service transacoes-ofx.service.ts
3. Reverter as alterações no modelo transacao-response.model.ts
4. Reverter as alterações no componente review-transacoes.component.ts
5. Verificar se o componente retorna ao estado anterior com git status e git checkout se necessário