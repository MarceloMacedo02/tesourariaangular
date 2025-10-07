# Especificação: Tratamento de Erros na Importação de Arquivos OFX

## Roteiro de Design

Este documento descreve as correções implementadas para resolver o problema de erro na importação de arquivos OFX, especificamente o erro "Cannot read properties of undefined (reading 'transactions')". O problema ocorre quando o backend retorna um erro HTTP 403 (proibido) e o frontend tenta acessar propriedades inexistentes da resposta.

## Requisitos

### Requisitos Funcionais
1. O sistema deve tratar adequadamente respostas de erro do backend na importação de arquivos OFX
2. O sistema deve verificar a estrutura da resposta antes de tentar acessar propriedades específicas
3. O sistema deve exibir mensagens de erro claras e específicas para diferentes tipos de erro
4. O sistema deve evitar que a aplicação quebre quando receber respostas inesperadas

### Requisitos Não-Funcionais
1. O tratamento de erros não deve impactar negativamente a performance da aplicação
2. As mensagens de erro devem ser compreensíveis para o usuário final
3. O código deve manter a compatibilidade com as implementações anteriores

## Tarefas

- [x] Adicionar verificação de estrutura da resposta OFX antes de acessar propriedades
- [x] Implementar tratamento específico para erro HTTP 403 (acesso negado)
- [x] Adicionar tratamento para outros tipos de erro HTTP (401, falha de conexão)
- [x] Atualizar componente para exibir mensagens de erro mais claras
- [x] Verificar tipo da resposta antes de retornar do serviço
- [x] Manter compatibilidade com as interfaces existentes

## Implementação

### Componentes Atualizados

1. `src/app/services/transacoes-ofx.service.ts`
   - Adicionada verificação de estrutura da resposta OFX no método `transformOfxResponseToLegacy`
   - Adicionada proteção contra acesso a propriedades inexistentes
   - Adicionado tratamento adicional no operador `map` para validar o resultado final

2. `src/app/pages/financeiro/upload-ofx/upload-ofx.component.ts`
   - Adicionado tratamento específico para diferentes códigos de erro HTTP
   - Melhoradas as mensagens de erro exibidas ao usuário

## Opção de Reversão

Para reverter as alterações:
1. Reverter os commits relacionados à correção de erros de importação OFX
2. Ou restaurar os arquivos:
   - `src/app/services/transacoes-ofx.service.ts`
   - `src/app/pages/financeiro/upload-ofx/upload-ofx.component.ts`

As alterações são isoladas e não afetam outras partes críticas da aplicação, facilitando a reversão se necessário.