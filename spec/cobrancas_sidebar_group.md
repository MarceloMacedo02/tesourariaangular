# Grupo Cobranças no Sidebar

## Roteiro de Design

Este documento descreve a implementação de um novo grupo de menu "Cobranças" no sidebar da aplicação. O objetivo é organizar os itens relacionados a cobranças em um grupo separado para melhor usabilidade e navegação.

## Requisitos

- Criar um novo grupo de menu chamado "Cobranças" no sidebar
- O grupo deve aparecer após o grupo "CADASTROS" e antes do grupo "APPS"
- O grupo deve ter itens relacionados a cobranças (ex: listagem de cobranças, geração de cobranças, etc.)
- O grupo deve respeitar as regras de permissão existentes (apenas tesoureiros devem ter acesso)
- Os itens existentes de cobranças devem ser movidos ou duplicados para o novo grupo

## Tarefas

- [x] Analisar a estrutura atual do menu
- [ ] Criar este documento de especificação
- [ ] Adicionar o novo grupo de cobranças no menu.ts
- [ ] Adicionar itens relevantes ao grupo de cobranças
- [ ] Verificar se as alterações funcionam corretamente

## Opção de Reversão

Para reverter esta alteração, basta remover as entradas relacionadas ao grupo "Cobranças" no arquivo `src/app/layouts/sidebar/menu.ts`.