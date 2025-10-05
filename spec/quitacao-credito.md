# Quitação de Crédito Component

## Roteiro de Design

Implementar uma nova funcionalidade para quitar transações de crédito com base no endpoint fornecido. A implementação incluirá:

1. Criação de modelos para representar a nova estrutura de dados
2. Serviço para comunicação com a API de movimentações
3. Componente para registrar transações de crédito
4. Integração com o seletor de sócios e informações de cobrança
5. Funcionalidade para adicionar cobranças de rubricas

## Requisitos

### Requisitos funcionais:
1. Registrar transações de crédito no sistema
2. Seletor de sócios com busca via API
3. Exibição de cobranças mensais do sócio
4. Exibição de cobranças de rubricas (não mensalidade)
5. Opção para adicionar cobranças de rubricas
6. Validação de campos obrigatórios

### Requisitos não-funcionais:
1. Manter a consistência visual com o sistema
2. Garantir performance adequada na busca de sócios
3. Fornecer feedback visual adequado durante processos
4. Seguir os padrões do sistema Angular existente

### Critérios de aceitação:
1. O formulário deve permitir registrar transações de crédito
2. Deve haver um seletor de sócios funcional
3. As cobranças do sócio devem ser exibidas ao selecionar um sócio
4. Deve haver opção para adicionar novas cobranças de rubricas

## Tarefas

- [ ] Criar especificação em spec/quitacao-credito.md
- [ ] Criar modelo para movimentação financeira
- [ ] Criar serviço para comunicação com API de movimentações
- [ ] Criar componente para quitação de crédito
- [ ] Implementar seletor de sócios
- [ ] Exibir cobranças relacionadas ao sócio selecionado
- [ ] Implementar funcionalidade para adicionar cobranças de rubricas
- [ ] Registrar componente no módulo da aplicação
- [ ] Adicionar rota para o novo componente
- [ ] Testar funcionalidade após as alterações

## Opção de Reversão

Para reverter as alterações, basta remover os seguintes arquivos e código:
- `src/app/models/movimentacao.model.ts`
- `src/app/services/movimentacoes.service.ts`
- `src/app/components/quitacao-credito/`
- Atualizações em `src/app/app.module.ts`
- Atualizações em `src/app/app-routing.module.ts`