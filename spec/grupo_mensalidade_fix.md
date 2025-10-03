# Correção de Violação de Integridade de Dados em Grupo de Mensalidade

## Roteiro de Design

Este documento descreve as alterações realizadas para corrigir o erro de violação de integridade de dados (SQL 23502) que ocorria quando o campo `GRUPO_MENSALIDADE_ID` estava sendo enviado como NULL durante atualizações na tabela `item_rubrica_mensalidade`.

### Componente Atualizado

- **GrupoMensalidadeFormComponent** (`src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component.ts`)

## Requisitos

1. Garantir que o campo `grupoMensalidadeId` seja sempre definido nos itens de rubrica mensalidade antes de enviar para o backend
2. Manter a funcionalidade existente do formulário de grupo de mensalidade
3. Corrigir a violação de integridade de dados sem alterar a estrutura do backend

## Tarefas

- [x] Analisar o modelo e a estrutura de dados de Grupo de Mensalidade
- [x] Identificar o ponto onde o campo `grupoMensalidadeId` não estava sendo preenchido
- [x] Implementar lógica para garantir que `grupoMensalidadeId` seja definido antes de enviar dados para o backend
- [x] Testar a correção para garantir que o erro não ocorra mais
- [x] Documentar a alteração realizada

## Detalhes da Implementação

### Problema Identificado

O erro de violação de integridade de dados ocorria porque:

1. O campo `grupoMensalidadeId` na entidade `ItemRubricaMensalidade` é obrigatório (NOT NULL) no banco de dados
2. Quando itens eram adicionados ao grupo de mensalidade no frontend, o campo `grupoMensalidadeId` não era preenchido
3. Ao enviar os dados para atualização no backend, os itens eram salvos com `grupoMensalidadeId` como NULL
4. O banco de dados rejeitava a operação por violação da restrição NOT NULL

### Solução Implementada

Adicionado código no método `onSubmit()` do componente que garante que todos os itens de rubrica mensalidade tenham o campo `grupoMensalidadeId` corretamente definido antes de enviar os dados para o backend:

```typescript
// Garantir que todos os itens de rubrica tenham o grupoMensalidadeId definido antes de enviar
if (this.grupoMensalidade.itensRubricaMensalidade) {
  this.grupoMensalidade.itensRubricaMensalidade = this.grupoMensalidade.itensRubricaMensalidade.map(item => {
    return {
      ...item,
      grupoMensalidadeId: this.grupoMensalidade.id || undefined
    };
  });
}
```

### Funcionamento

1. Antes de enviar os dados para o backend, o código itera por todos os itens de rubrica mensalidade
2. Para cada item, garante que o campo `grupoMensalidadeId` esteja definido com o ID do grupo mensalidade atual
3. Isso garante que o backend receba os dados com as informações necessárias para manter a integridade do banco de dados

## Opção de Reversão

Para reverter as alterações:

1. Reverter o método `onSubmit()` no arquivo `src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component.ts` para a versão anterior
2. Remover a lógica de definição do `grupoMensalidadeId` antes do envio para o backend

O erro de violação de integridade de dados retornará se a alteração for revertida e itens de rubrica forem salvos sem ter o `grupoMensalidadeId` definido.