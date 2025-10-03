# Atualização do Grupo Financeiro - Especificação

## Roteiro de Design

Esta atualização teve como objetivo ajustar a estrutura de dados do Grupo Financeiro para incluir os campos `dataRegistro` e `dataAtualizacao`, e propagar essas alterações nos componentes de formulário e listagem. Também foi implementado o uso do `ng-select` para melhor experiência do usuário no campo de seleção de centro de custo.

Importante: Os campos `dataRegistro` e `dataAtualizacao` são de uso EXCLUSIVO do backend e não devem ser manipulados no frontend, sendo exibidos apenas para informação.

Componentes envolvidos:
- GrupoFinanceiro.model.ts (interface)
- GrupoFinanceiroFormComponent (formulário de cadastro/edição)
- GrupoFinanceiroComponent (listagem)
- GrupoFinanceiroService (serviço de comunicação com API)
- CadastrosModule (módulo que registra os componentes)

Arquitetura proposta: 
- Utilizar o formato ISO 8601 (string) para campos de data conforme especificação
- Campos de data serão exibidos como readonly nos formulários e listagens
- A tabela de listagem mostrará os campos de data formatados
- O componente ng-select será usado para seleção de centro de custo
- Comentários explicativos serão adicionados para indicar que esses campos são de uso exclusivo do backend

## Requisitos

### Requisitos Funcionais
- O modelo GrupoFinanceiro deve conter os campos `dataRegistro` e `dataAtualizacao` no formato ISO 8601
- O formulário de cadastro/edição deve exibir os campos de data como readonly quando existirem
- A tela de listagem deve exibir os campos de data formatados
- O campo de seleção de centro de custo deve utilizar o componente `ng-select`
- O ng-select deve permitir pesquisa e seleção de centro de custo
- Comentários devem indicar claramente que os campos de data são de uso exclusivo do backend

### Requisitos Não-Funcionais
- Manter a compatibilidade com o backend existente
- Preservar o comportamento existente para todas as funcionalidades não relacionadas
- Manter a consistência visual com o restante da aplicação
- Documentar claramente quais campos são de uso exclusivo do backend

### Dependências
- Biblioteca `@ng-select/ng-select` já disponível no projeto
- Backend que forneça os campos `dataRegistro` e `dataAtualizacao`

### Critérios de Aceitação
- Modelo atualizado com novos campos e comentários apropriados
- Formulário exibindo campos de data corretamente com indicação de uso backend-only
- Listagem exibindo campos de data corretamente com indicação de uso backend-only
- Componente de seleção de centro de custo funcionando com ng-select
- Aplicação compilando sem erros
- Funcionalidades de CRUD continuando a funcionar corretamente
- Comentários e documentação claramente indicando campos de uso exclusivo do backend

## Tarefas

- [x] Atualizar a interface GrupoFinanceiro.model para incluir os campos dataRegistro e dataAtualizacao
- [x] Atualizar o componente grupo-financeiro-form para exibir os campos dataRegistro e dataAtualizacao como readonly
- [x] Atualizar o componente grupo-financeiro para exibir os campos dataRegistro e dataAtualizacao na tabela
- [x] Atualizar o service para lidar com os novos campos (verificar se o backend suporta)
- [x] Implementar ng-select para seleção de centro de custo
- [x] Importar NgSelectModule no módulo de cadastros
- [x] Adicionar comentários indicando que campos de data são de uso exclusivo do backend
- [x] Resolver problema com ng-select não atualizando o modelo corretamente
- [x] Documentar as alterações

## Solução do Problema com ng-select

Foi identificado um problema com o ng-select não atualizando corretamente o modelo `grupoFinanceiro.centroCustoId` quando um item era selecionado. A solução implementada foi:

1. Criar uma variável intermediária `selectedCentroCustoId` para controlar o valor do ng-select
2. Atualizar o ng-select para usar essa variável intermediária no [(ngModel)]
3. Criar um listener `change` para sincronizar o valor selecionado com o modelo principal
4. Atualizar a validação para usar a variável intermediária
5. Garantir que ao carregar dados existentes, ambos os valores (modelo e variável intermediária) sejam definidos corretamente

## Exibição do Nome do Centro de Custo na Tabela

Para exibir o nome do centro de custo na tabela em vez do ID, foram feitas as seguintes alterações:

1. Atualizado o modelo GrupoFinanceiro para incluir o campo `centroCustoNome`
2. Atualizado o componente de listagem para exibir o nome do centro de custo na tabela
3. A implementação assume que o backend retornará o nome do centro de custo no campo `centroCustoNome`

## Opção de Reversão

Para reverter as alterações:

1. Reverter as mudanças no arquivo `src/app/pages/cadastros/grupo-financeiro/grupo-financeiro.model.ts`
2. Reverter as mudanças no arquivo `src/app/pages/cadastros/grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component.html`
3. Reverter as mudanças no arquivo `src/app/pages/cadastros/grupo-financeiro/grupo-financeiro-form/grupo-financeiro-form.component.ts`
4. Reverter as mudanças no arquivo `src/app/pages/cadastros/grupo-financeiro/grupo-financeiro.component.html`
5. Reverter as mudanças no arquivo `src/app/pages/cadastros/cadastros.module.ts`
6. Excluir este arquivo de especificação

Se o git estiver sendo usado, basta executar:
`git checkout -- src/app/pages/cadastros/grupo-financeiro/ src/app/pages/cadastros/cadastros.module.ts spec/grupo_financeiro_atualizacao.md`