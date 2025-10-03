# Adição de Botão para Visualizar Cobranças na Lista de Geração em Lote

## Roteiro de Design

Este documento descreve as alterações realizadas para adicionar um botão na lista de sócios da página de geração de cobranças em lote, permitindo visualizar as cobranças associadas a cada sócio.

## Requisitos

1. Adicionar coluna "Ações" na tabela de sócios da página de geração de cobranças em lote
2. Incluir botão "Visualizar Cobranças" em cada linha da tabela
3. Direcionar o usuário para a página de cobranças do sócio ao clicar no botão
4. Manter a funcionalidade existente da página intacta
5. Garantir consistência visual com o restante do sistema

## Componentes Envolvidos

- `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts` - Componente de geração de cobranças em lote

## Tarefas

- [x] Adicionar coluna "Ações" no cabeçalho da tabela de sócios
- [x] Adicionar botão "Visualizar Cobranças" em cada linha da tabela
- [x] Configurar roteamento para a página de cobranças do sócio
- [x] Atualizar colspans nas linhas de carregamento e dados vazios
- [x] Testar a funcionalidade para garantir que o botão funciona corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Adição da Coluna de Ações

1. Adicionada coluna "Ações" no cabeçalho da tabela:
   ```html
   <th>Ações</th>
   ```

2. Adicionada célula correspondente em cada linha da tabela com o botão:
   ```html
   <td>
     <button type="button" class="btn btn-soft-info btn-sm" 
             [routerLink]="'/pages/cobrancas/socio/' + socio.id" 
             title="Visualizar Cobranças">
       <i class="ri-file-list-fill align-bottom"></i>
     </button>
   </td>
   ```

3. Atualizados os colspans nas linhas de carregamento e dados vazios de 9 para 10:
   ```html
   <td colspan="10" class="text-center">
   ```

### Funcionamento

1. Na página de geração de cobranças em lote, cada sócio na tabela agora tem um botão de ações
2. O botão "Visualizar Cobranças" (ícone de lista de arquivos) permite acessar as cobranças do sócio
3. Ao clicar no botão, o usuário é redirecionado para `/pages/cobrancas/socio/{id}` onde `{id}` é o ID do sócio
4. A página de destino exibe todas as cobranças associadas ao sócio selecionado
5. O usuário pode voltar à página anterior usando o botão de navegação do navegador ou o botão "Voltar" na página de cobranças

### Estilo e Usabilidade

1. Botão com estilo `btn-soft-info` para manter consistência com o design do sistema
2. Ícone `ri-file-list-fill` para representar visualmente a função de listagem de cobranças
3. Título `title="Visualizar Cobranças"` para melhor acessibilidade
4. Tamanho pequeno `btn-sm` para caber adequadamente na tabela
5. Hover e foco consistentes com os outros botões da interface

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts`:
   - Remover a coluna "Ações" do cabeçalho da tabela
   - Remover a célula de ações de cada linha da tabela
   - Atualizar os colspans das linhas de carregamento e dados vazios de volta para 9
   - Remover o import do RouterLink se foi adicionado