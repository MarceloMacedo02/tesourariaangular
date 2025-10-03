# Atualização do Componente de Listagem de Cobranças

## Roteiro de Design

Este documento descreve as alterações realizadas para atualizar o componente de listagem de cobranças, transformando-o de uma página simples em desenvolvimento para um componente funcional completo com capacidade de listar, filtrar e paginar todas as cobranças do sistema.

## Requisitos

1. Transformar o componente de listagem de cobranças em uma página funcional
2. Implementar listagem de todas as cobranças do sistema
3. Adicionar funcionalidade de filtragem
4. Implementar paginação dos resultados
5. Exibir informações detalhadas de cada cobrança
6. Manter a consistência visual com o restante do sistema

## Componentes Envolvidos

- `src/app/pages/cadastros/cobrancas/billing-list.component.ts` - Componente principal de listagem
- `src/app/pages/cadastros/cobrancas/non-monthly-billing.service.ts` - Serviço de cobranças
- `src/app/pages/cadastros/cobrancas/non-monthly-billing.model.ts` - Modelo de dados

## Tarefas

- [x] Atualizar o template do componente para incluir tabela de cobranças
- [x] Implementar lógica de carregamento de dados
- [x] Adicionar funcionalidade de filtragem
- [x] Implementar paginação dos resultados
- [x] Adicionar formatação adequada para valores monetários
- [x] Implementar exibição de datas formatadas
- [x] Adicionar indicadores visuais de status das cobranças
- [x] Implementar tratamento de erros
- [x] Adicionar estado de carregamento
- [x] Testar a funcionalidade para garantir que tudo funciona corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Atualização do Template

1. Substituído o template simples por uma interface completa com:
   - Barra de filtros
   - Tabela responsiva com todas as informações das cobranças
   - Paginação
   - Tratamento de estados (carregamento, erro, dados vazios)

2. Colunas da tabela:
   - ID
   - Sócio (nome e ID)
   - Tipo de cobrança
   - Descrição
   - Valor (formatado como moeda)
   - Data de vencimento (formatada)
   - Status (com indicadores visuais)
   - Data de registro (formatada)
   - Ações (botão de visualização)

### Lógica de Componente

1. Implementado carregamento de dados através do serviço `NonMonthlyBillingService`
2. Adicionado filtragem local dos dados (simulando filtragem no backend)
3. Implementado paginação dos resultados
4. Adicionados métodos auxiliares para:
   - Formatação de texto de tipo de cobrança
   - Formatação de texto de status de cobrança
   - Classes CSS para indicadores visuais de status
   - Cálculo de páginas visíveis na paginação

### Funcionalidades

1. **Listagem**: Exibe todas as cobranças do sistema em uma tabela organizada
2. **Filtragem**: Permite filtrar cobranças por ID, nome do sócio ou descrição
3. **Paginação**: Divide os resultados em páginas para melhor performance
4. **Atualização**: Botão para recarregar os dados
5. **Tratamento de erros**: Exibe mensagens amigáveis em caso de erro
6. **Estado de carregamento**: Mostra spinner durante o carregamento dos dados

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/pages/cadastros/cobrancas/billing-list.component.ts`:
   - Substituir o conteúdo pelo template e lógica originais (apenas texto de desenvolvimento)
   - Remover todos os imports adicionais
   - Remover todas as propriedades e métodos adicionados
   - Reverter o construtor para o estado original
2. No HTML, remover todas as seções de filtro, tabela, paginação e tratamento de erros