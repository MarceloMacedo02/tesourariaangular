# Integração de Fornecedores, Rubricas e Sócios

## Roteiro de Design

Este projeto atualiza os componentes do frontend para consumir fornecedores, rubricas e sócios dos endpoints corretos do backend, em vez de usar valores chumbados. Foi criado um serviço centralizado para gerenciar essas referências financeiras com as seguintes funcionalidades:

- GET /api/api/simples/rubricas - Retorna lista de rubricas no formato: [{"id": 1, "nome": "Exemplo"}]
- GET /api/api/simples/socios - Retorna lista de sócios no formato: [{"id": 1, "nome": "Exemplo"}]
- GET /api/api/simples/fornecedores - Retorna lista de fornecedores no formato: [{"id": 1, "nome": "Exemplo"}]

## Requisitos

- [x] Criar serviço para fornecedores, rubricas e sócios usando endpoints corretos
- [x] Atualizar componentes de contas a pagar para usar o novo serviço
- [x] Atualizar componentes de cobranças avulsas para usar o novo serviço
- [x] Atualizar componentes de contas a receber para usar o novo serviço
- [x] Garantir que os selects usem ng-select com dados dinâmicos
- [x] Implementar seleção exclusiva entre sócio e fornecedor
- [x] Manter validação adequada nos formulários

## Tarefas

- [x] Criar serviço ReferenciasFinanceirasService com endpoints corretos
- [x] Atualizar ContasPagarFormComponent para usar novos endpoints
- [x] Atualizar CobrancasAvulsasFormComponent para usar novos endpoints
- [x] Atualizar ContasAReceberFormComponent para usar novos endpoints
- [x] Adicionar funcionalidade de sócios aos componentes
- [x] Implementar seleção exclusiva entre sócio e fornecedor
- [x] Atualizar imports e tipagem
- [x] Testar build do projeto

## Opção de Reversão

Para reverter estas alterações:

1. Remover o arquivo `src/app/services/referencias-financeiras.service.ts`
2. Reverter os componentes modificados para os estados anteriores:
   - `src/app/pages/financeiro/contas-a-pagar/contas-a-pagar-form.component.ts`
   - `src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas-form.component.ts`
   - `src/app/pages/financeiro/contas-a-receber/contas-a-receber-form.component.ts`
3. Remover os imports e uso do novo serviço nos componentes
4. Reverter as alterações de template para usar selects com valores chumbados
