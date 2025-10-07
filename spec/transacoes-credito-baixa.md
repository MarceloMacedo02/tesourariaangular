# Transações de Crédito e Baixa de Transações

## Roteiro de Design

Este ajuste implementa duas funcionalidades principais no módulo financeiro:

1. Componente para listar transações de crédito com filtros por mês e ano
2. Componente para dar baixa em transações específicas
3. Atualização do menu para incluir os novos componentes

## Requisitos

- [x] Criar modelo para detalhes de transação
- [x] Criar componente para transações de crédito com filtros
- [x] Atualizar serviço para buscar transações detalhadas com paginação
- [x] Atualizar módulo financeiro para incluir novos componentes
- [x] Adicionar rotas para os novos componentes
- [x] Criar componente para baixa de transações
- [x] Adicionar links para os novos componentes no menu

## Tarefas

- [x] Criar modelo para detalhes de transação
- [x] Criar componente para transações de crédito
- [x] Atualizar serviço para buscar transações detalhadas
- [x] Atualizar módulo financeiro para incluir novo componente
- [x] Adicionar rota para o novo componente
- [x] Criar componente para baixa de transações
- [x] Adicionar links para os novos componentes no menu

## Opção de Reversão

Caso seja necessário reverter as alterações:

1. Remover os componentes criados:
   - transacoes-credito
   - baixa-transacao
2. Remover as importações e declarações desses componentes nos módulos
3. Remover as rotas relacionadas aos componentes
4. Reverter as alterações no arquivo de menu
5. Remover o modelo de transação detalhada
6. Remover o método do serviço relacionado a transações detalhadas