# Transacoes Credito Component

## Roteiro de Design

Implementar funcionalidade para visualizar transações de crédito de acordo com o endpoint real `/api/transacoes-detalhadas`. O componente permitirá aos usuários filtrar transações por mês, ano e tipo (CREDITO), com paginação, e exibir os resultados com todas as propriedades especificadas na resposta da API.

### Componentes envolvidos:
1. Service para comunicação com a API
2. Componente Angular para interface de transações de crédito
3. Componente Angular para edição de transações de crédito
4. Modelo para representar a resposta da API

### Arquitetura proposta:
- Atualizar o modelo TransacaoDetalhada para refletir a estrutura real da API
- Atualizar o service TransacoesOfxService para consumir o endpoint real
- Atualizar os componentes TransacoesCredito e TransacoesCreditoEditar para usar a nova estrutura de dados

## Requisitos

### Requisitos Funcionais:
1. O componente deve chamar o endpoint GET `/api/transacoes-detalhadas` com os parâmetros mes, ano, tipo, page e size
2. Exibir a lista de transações retornadas conforme a estrutura detalhada
3. Implementar paginação correta com base na resposta da API
4. Exibir informações detalhadas conforme especificado (cobranças, sócios, fornecedores)

### Requisitos Não-Funcionais:
1. Tratamento adequado de erros
2. Feedback visual durante o carregamento
3. Validação dos filtros obrigatórios (mês e ano)
4. Uso da URL base da API configurada no ambiente

### Critérios de Aceitação:
1. O endpoint deve ser chamado com sucesso e retornar os dados corretos
2. A resposta da API deve ser corretamente mapeada e exibida
3. A paginação deve funcionar conforme os metadados retornados pela API
4. A interface deve fornecer feedback adequado durante o processo

## Tarefas

- [x] Criar arquivo de especificação em spec/transacoes-credito-component.md
- [ ] Atualizar modelo TransacaoDetalhada para refletir a estrutura da API
- [ ] Atualizar service para consumir o endpoint real
- [ ] Atualizar componente TransacoesCredito para usar a nova estrutura
- [ ] Atualizar componente TransacoesCreditoEditar para usar a nova estrutura
- [ ] Testar funcionalidade com o endpoint real

## Opção de Reversão

Para desfazer as alterações:
1. Excluir o arquivo spec/transacoes-credito-component.md
2. Reverter as alterações no service transacoes-ofx.service.ts
3. Reverter as alterações no modelo transacao-detalhada.model.ts
4. Reverter as alterações nos componentes transacoes-credito.component.ts e transacoes-credito-editar.component.ts
5. Verificar se os componentes retornam ao estado anterior com git status e git checkout se necessário