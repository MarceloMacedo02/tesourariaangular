# Funcionalidade de Cobrança Não Mensalidade

## Roteiro de Design

Este documento descreve a implementação de uma nova funcionalidade para geração de cobranças não mensais para sócios. Esta funcionalidade permitirá criar cobranças avulsas (não mensais) tanto individualmente quanto em lote.

## Requisitos

### Requisitos Funcionais
- Permitir a geração de cobranças não mensais para sócios individuais
- Permitir a geração de cobranças não mensais em lote para múltiplos sócios
- Integrar com o sistema existente de cobranças
- Adicionar opções no menu do sidebar para acesso às funcionalidades
- Permitir selecionar sócios, definir valores e datas para as cobranças

### Requisitos Não-Funcionais
- Seguir padrões de código e design do sistema existente
- Manter consistência com a interface atual
- Respeitar regras de autorização (apenas tesoureiro deve ter acesso)
- Manter a usabilidade e experiência do usuário

## Tarefas

- [ ] Criar especificação da funcionalidade (in_progress)
- [ ] Analisar estrutura atual de cobrança mensalidade
- [ ] Criar componente para geração de cobrança individual
- [ ] Criar componente para geração de cobrança em lote
- [ ] Criar ou atualizar serviço para lidar com cobranças não mensais
- [ ] Atualizar menu do sidebar para incluir novas opções
- [ ] Testar a nova funcionalidade

## Componentes a Serem Criados

1. **Componente de Cobrança Individual Não Mensal**:
   - Seleção de sócio
   - Definição de valor
   - Definição de data de vencimento
   - Descrição/opcional para identificação da cobrança

2. **Componente de Cobrança em Lote Não Mensal**:
   - Filtro e seleção de múltiplos sócios
   - Definição de valor
   - Definição de data de vencimento
   - Descrição/opcional para identificação da cobrança

## Opção de Reversão

Para reverter esta alteração, basta remover os componentes, serviços e entradas de menu criados, e restaurar os arquivos modificados.