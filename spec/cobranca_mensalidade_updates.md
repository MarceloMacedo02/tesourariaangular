# Atualizações na Funcionalidade de Geração de Cobrança de Mensalidade

## Roteiro de Design

Este documento descreve as alterações realizadas para melhorar a funcionalidade de geração de cobrança de mensalidade, incluindo:

1. Atualização do nome no menu sidebar de "Gerar Cobranças" para "Gerar Cobrança Mensalidade"
2. Adição de colunas na tabela de sócios para exibir Grupo de Mensalidade e Valor da Mensalidade

## Requisitos

1. Atualizar o nome do menu no sidebar conforme solicitado
2. Adicionar colunas de Grupo de Mensalidade e Valor da Mensalidade na tabela de sócios
3. Manter a funcionalidade existente intacta
4. Garantir que as informações sejam exibidas corretamente

## Componentes Envolvidos

- `src/app/layouts/sidebar/menu.ts` - Atualização do nome no menu
- `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts` - Adição das colunas na tabela e lógica para exibir as informações

## Tarefas

- [x] Atualizar o nome no menu sidebar
- [x] Modificar o componente de cobrança em lote para carregar grupos de mensalidade
- [x] Adicionar colunas de Grupo de Mensalidade e Valor da Mensalidade na tabela de sócios
- [x] Implementar métodos para obter nome do grupo e valor da mensalidade
- [x] Testar a funcionalidade para garantir que as informações são exibidas corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Atualização do Menu

Atualizado o label do menu no arquivo `menu.ts` do ID 25 de:
`'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCAS'` para `'MENUITEMS.COBRANCAS.LIST.GERARCOBRANCAMENSALIDADE'`

### Adição de Funcionalidades no Componente de Cobrança em Lote

1. Adicionado importação da interface GrupoMensalidade
2. Adicionada propriedade `gruposMensalidade: GrupoMensalidade[]`
3. Adicionada propriedade `loadingGrupos: boolean`
4. Adicionado método `loadGruposMensalidade()` para carregar os grupos de mensalidade
5. Atualizado `ngOnInit()` para chamar `loadGruposMensalidade()`
6. Adicionados métodos `getGrupoMensalidadeNome()` e `getValorMensalidade()` 
7. Atualizado template HTML para incluir colunas de Grupo de Mensalidade e Valor da Mensalidade
8. Atualizado colspan das células de carregamento e dados vazios para 9 colunas

### Funcionamento

1. Ao carregar a página, os grupos de mensalidade são carregados em segundo plano
2. A tabela de sócios mostra as colunas adicionais de Grupo de Mensalidade e Valor da Mensalidade
3. O valor total do grupo (já disponível nos dados do backend) é exibido formatado como moeda

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/layouts/sidebar/menu.ts`, reverta o label do ID 25 para o valor original
2. No arquivo `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts`:
   - Remova a importação da interface GrupoMensalidade e do serviço GrupoMensalidadeService
   - Remova as propriedades adicionais
   - Remova os métodos adicionados
   - Remova as colunas adicionais no template HTML
   - Atualize os colspans novamente para 7
   - Remova a chamada para `loadGruposMensalidade()` em `ngOnInit()`
   - Remova o serviço GrupoMensalidadeService do construtor