# Cadastro de Rubricas - Especificação

## Roteiro de Design

Esta funcionalidade implementa o cadastro completo de rubricas, incluindo listagem, cadastro, edição e exclusão. A estrutura de dados segue a especificação fornecida com os campos obrigatórios e opcionais.

Componentes envolvidos:
- Rubricas.model.ts (interface)
- Rubricas.service.ts (serviço de comunicação com API)
- RubricasComponent (listagem)
- RubricasFormComponent (formulário de cadastro/edição)
- CadastrosModule (módulo que registra os componentes)

Arquitetura proposta:
- Utilizar o formato ISO 8601 (string) para campos de data conforme especificação
- Campos de data serão exibidos como readonly nos formulários
- A tabela de listagem mostrará os campos formatados
- O componente ng-select será usado para seleção de grupo financeiro
- Máscara monetária será aplicada ao campo valor

## Requisitos

### Requisitos Funcionais
- O modelo Rubrica deve conter todos os campos especificados
- O formulário de cadastro/edição deve validar todos os campos obrigatórios
- A tela de listagem deve permitir paginação e filtragem
- A tela de listagem deve exibir todos os campos da rubrica
- O formulário deve usar máscara monetária para o campo valor
- O formulário deve usar ng-select para seleção de grupo financeiro

### Requisitos Não-Funcionais
- Manter a compatibilidade com o backend existente
- Preservar o comportamento existente para todas as funcionalidades não relacionadas
- Manter a consistência visual com o restante da aplicação
- Seguir os padrões de código estabelecidos no projeto

### Dependências
- Bibliotecas `@ng-select/ng-select` e `ngx-mask` já disponíveis no projeto
- Backend que forneça os endpoints para rubricas

### Critérios de Aceitação
- Modelo atualizado com todos os campos especificados
- Formulário validando corretamente todos os campos
- Listagem exibindo corretamente todos os campos
- Máscara monetária funcionando corretamente
- Componente de seleção de grupo financeiro funcionando com ng-select
- Aplicação compilando sem erros
- Funcionalidades de CRUD continuando a funcionar corretamente

## Tarefas

- [x] Criar modelo de dados para Rubricas
- [x] Criar serviço para Rubricas
- [x] Criar componente de listagem para Rubricas
- [x] Criar componente de formulário para Rubricas
- [x] Atualizar o componente principal de Rubricas
- [x] Adicionar ng-select para seleção de grupo financeiro
- [x] Implementar máscara monetária para o campo valor
- [x] Corrigir tipo do campo grupoFinanceiroId para permitir valores opcionais
- [x] Adicionar link no menu de sidebar para Rubricas

## Implementação de Máscara Monetária

A máscara monetária foi implementada usando a diretiva `currencyMask` da biblioteca `ngx-currency` com as seguintes configurações:
- Separador de milhar: "."
- Separador decimal: ","
- Prefixo: "R$ "
- Duas casas decimais
- Não permite valores negativos
- Valores nulos são permitidos

## Opção de Reversão

Para reverter as alterações:

1. Excluir os arquivos:
   - `src/app/pages/cadastros/rubricas/rubricas.model.ts`
   - `src/app/pages/cadastros/rubricas/rubricas.service.ts`
   - `src/app/pages/cadastros/rubricas/rubricas.component.html`
   - `src/app/pages/cadastros/rubricas/rubricas.component.scss`
   - `src/app/pages/cadastros/rubricas/rubricas.component.ts`
   - `src/app/pages/cadastros/rubricas/rubricas-form/rubricas-form.component.html`
   - `src/app/pages/cadastros/rubricas/rubricas-form/rubricas-form.component.scss`
   - `src/app/pages/cadastros/rubricas/rubricas-form/rubricas-form.component.ts`
2. Reverter as mudanças no arquivo `src/app/pages/cadastros/cadastros.module.ts`
3. Excluir este arquivo de especificação

Se o git estiver sendo usado, basta executar:
`git checkout -- src/app/pages/cadastros/rubricas/ src/app/pages/cadastros/cadastros.module.ts spec/rubricas_cadastro.md`