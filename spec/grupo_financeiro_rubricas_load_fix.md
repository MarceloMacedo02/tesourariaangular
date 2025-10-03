# Correção do Carregamento de Grupos Financeiros no Formulário de Rubricas

## Roteiro de Design

Correção do problema onde a lista de grupos financeiros não estava sendo carregada no formulário de rubricas. O problema estava no serviço de rubricas que chamava o endpoint `/api/grupos-financeiros` diretamente, mas esse endpoint provavelmente retorna uma resposta paginada, não uma lista simples como esperado pelo ng-select no formulário de rubricas.

## Requisitos

### Requisitos Funcionais
- O formulário de rubricas deve carregar corretamente a lista de grupos financeiros
- O ng-select para grupos financeiros deve exibir os itens corretamente
- O endpoint deve retornar dados no formato adequado para o ng-select (com propriedades id e nomeGrupoFinanceiro)

### Requisitos Não-Funcionais
- O código deve seguir as boas práticas e padrões do projeto
- A solução deve ser eficiente e não impactar negativamente o desempenho da aplicação
- O tratamento de erros deve ser adequado

### Critérios de Aceitação
- Quando o formulário de rubricas é aberto, a lista de grupos financeiros aparece no ng-select
- É possível selecionar um grupo financeiro no formulário
- O formulário funciona corretamente para criar e editar rubricas com grupos financeiros associados

## Tarefas

- [x] Analisar o serviço que carrega os grupos financeiros
- [x] Modificar o serviço para lidar com a resposta paginada corretamente
- [x] Adicionar o operador map para extrair o conteúdo da paginação
- [x] Melhorar o tratamento de erros para incluir erros de autenticação
- [x] Testar a implementação para garantir que os grupos financeiros são carregados corretamente

## Opção de Reversão

Caso seja necessário reverter esta implementação:

1. Reverter as alterações no arquivo `src/app/pages/cadastros/rubricas/rubricas.service.ts`
2. Reverter as alterações no arquivo `src/app/pages/cadastros/rubricas/rubricas-form/rubricas-form.component.ts`
3. Remover o import do operador 'map' e a transformação da resposta

Comandos git para reverter:
```bash
git checkout -- src/app/pages/cadastros/rubricas/rubricas.service.ts
git checkout -- src/app/pages/cadastros/rubricas/rubricas-form/rubricas-form.component.ts
```