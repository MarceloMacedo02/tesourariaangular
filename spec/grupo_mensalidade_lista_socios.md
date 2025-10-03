# Adição da Coluna de Grupo de Mensalidade na Lista de Sócios

## Roteiro de Design

Este documento descreve as alterações realizadas para adicionar a coluna de grupo de mensalidade na lista de sócios (`/cadastros/socio/lista`), exibindo o nome do grupo de mensalidade associado a cada sócio.

## Requisitos

1. Adicionar coluna "Grupo Mensalidade" na tabela de sócios
2. Exibir o nome do grupo de mensalidade associado a cada sócio
3. Manter a funcionalidade de paginação e filtragem intacta
4. Garantir que os dados sejam carregados corretamente

## Componentes Envolvidos

- `src/app/pages/cadastros/socio/socio.component.ts` - Lógica do componente
- `src/app/pages/cadastros/socio/socio.component.html` - Template da tabela

## Tarefas

- [x] Importar GrupoMensalidade e GrupoMensalidadeService
- [x] Adicionar propriedades para armazenar os grupos de mensalidade
- [x] Carregar os grupos de mensalidade no componente
- [x] Criar método para obter o nome do grupo de mensalidade
- [x] Atualizar o template HTML para incluir a nova coluna
- [x] Atualizar os colspans nas seções de carregamento e dados vazios
- [x] Testar a funcionalidade para garantir que os dados são exibidos corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Atualizações no Componente TypeScript

1. Adicionada importação de GrupoMensalidade e GrupoMensalidadeService
2. Adicionada propriedade `gruposMensalidade: GrupoMensalidade[]`
3. Adicionada propriedade `loadingGruposMensalidade: boolean`
4. Adicionado serviço GrupoMensalidadeService ao construtor
5. Atualizado `ngOnInit()` para chamar `loadGruposMensalidade()`
6. Adicionado método `loadGruposMensalidade()` para carregar os grupos de mensalidade
7. Adicionado método `getGrupoMensalidadeNome()` para obter o nome do grupo

### Atualizações no Template HTML

1. Adicionada coluna "Grupo Mensalidade" no cabeçalho da tabela
2. Adicionado dado correspondente na linha de cada sócio
3. Atualizado colspan das células de carregamento e dados vazios de 7 para 8

### Funcionamento

1. Ao carregar a página, os grupos de mensalidade são carregados em segundo plano
2. A tabela de sócios mostra a nova coluna "Grupo Mensalidade"
3. Para cada sócio, o nome do grupo associado é exibido
4. Se o sócio não tiver grupo associado, mostra "-" (traço)
5. A paginação e filtragem continuam funcionando normalmente

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/pages/cadastros/socio/socio.component.ts`:
   - Remova as importações de GrupoMensalidade e GrupoMensalidadeService
   - Remova a propriedade gruposMensalidade
   - Remova a propriedade loadingGruposMensalidade
   - Remova o serviço GrupoMensalidadeService do construtor
   - Remova a chamada para `loadGruposMensalidade()` em `ngOnInit()`
   - Remova os métodos `loadGruposMensalidade()` e `getGrupoMensalidadeNome()`

2. No arquivo `src/app/pages/cadastros/socio/socio.component.html`:
   - Remova a coluna "Grupo Mensalidade" do cabeçalho da tabela
   - Remova a célula correspondente na linha de cada sócio
   - Atualize os colspans novamente para 7