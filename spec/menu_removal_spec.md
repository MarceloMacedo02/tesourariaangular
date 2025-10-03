# Remoção de Menus do Sidebar

## Roteiro de Design

Este documento descreve as alterações realizadas para remover os seguintes menus do sidebar:
- "Listar Cobranças"
- "Cobranças Não Mensalidade"

## Requisitos

1. Remover o item "Listar Cobranças" do menu
2. Remover o item "Cobranças Não Mensalidade" e seus subitens do menu
3. Manter os demais menus intactos

## Componentes Envolvidos

- `src/app/layouts/sidebar/menu.ts` - Arquivo de definição dos menus do sidebar

## Tarefas

- [x] Identificar os itens de menu a serem removidos
- [x] Remover o item "Listar Cobranças" (id: 26)
- [x] Remover o item "Cobranças Não Mensalidade" com subitens (id: 27, 28, 29)
- [x] Verificar integridade do menu após remoção

## Detalhes da Implementação

Foram removidos os seguintes itens do menu:
1. Item com ID 26: "Listar Cobranças" - `MENUITEMS.COBRANCAS.LIST.LISTARCOBRANCAS`
2. Item com ID 27: "Cobranças Não Mensalidade" - `MENUITEMS.COBRANCAS.LIST.COBRANCASNAOMENSALIDADE` e seus subitens:
   - ID 28: "Gerar Cobrança Não Mensalidade Individual" 
   - ID 29: "Gerar Cobrança Não Mensalidade em Lote"

O menu agora contém apenas:
- "Gerar Cobranças" (Mensalidades)
- "Cobranças Outras Rubricas" com seus subitens

## Opção de Reversão

Para reverter as alterações, basta restaurar os itens de menu removidos no arquivo `src/app/layouts/sidebar/menu.ts`, adicionando novamente o bloco de código:

```typescript
{
  id: 26,
  label: 'MENUITEMS.COBRANCAS.LIST.LISTARCOBRANCAS',
  icon: 'ti ti-file-invoice',
  link: '/pages/cobrancas/lista',
  parentId: 24,
},
{
  id: 27,
  label: 'MENUITEMS.COBRANCAS.LIST.COBRANCASNAOMENSALIDADE',
  icon: 'ti ti-file-invoice',
  parentId: 24,
  subItems: [
    {
      id: 28,
      label: 'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCASNAOMENSALIDADEINDIVIDUAL',
      link: '/pages/cadastros/cobrancas/nao-mensalidade-individual',
      parentId: 27,
    },
    {
      id: 29,
      label: 'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCASNAOMENSALIDADELOTE',
      link: '/pages/cadastros/cobrancas/nao-mensalidade-lote',
      parentId: 27,
    }
  ],
},
```