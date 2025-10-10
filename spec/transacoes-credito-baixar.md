# TransacoesCreditoEditarComponent - Funcionalidade de Baixa de Transações

## Roteiro de Design

O componente é responsável por permitir a baixa de transações de crédito, mostrando as cobranças associadas e permitindo selecionar quais serão quitadas. A funcionalidade de seleção e cálculo de saldos foi implementada usando o sistema de reatividade do Angular com Signals e Computed.

## Requisitos

- Exibir as cobranças de mensalidade, outras rubricas e avulsas associadas à transação
- Permitir seleção individual e em massa de cobranças
- Calcular automaticamente o valor total das cobranças selecionadas
- Permitir quitação das cobranças selecionadas

## Tarefas

- [x] Atualizar modelo TypeScript para refletir a estrutura completa do JSON
- [x] Remover o tab Contas a Receber do componente de baixar transações
- [x] Implementar cálculo automático de saldos conforme seleção de cobranças
- [x] Garantir que a seleção/deseleção de cobranças atualize imediatamente os totais

## Funcionalidade de Atualização de Saldo

Sempre que uma cobrança é selecionada ou deselecionada, o sistema faz o seguinte:
1. Atualiza o array de IDs selecionados (`selectedCobrancaIds`)
2. As computed signals automaticamente recalculam:
   - Total de mensalidades selecionadas
   - Total de outras rubricas selecionadas
   - Total geral de todas as cobranças selecionadas
3. O saldo exibido na interface é atualizado instantaneamente

## Opção de Reversão

Para reverter as alterações, basta restaurar os arquivos modificados para seus estados anteriores:
- transacoes-credito-editar.component.ts
- transacoes-credito-editar.component.html
- transacao-credito.service.ts