# Modernização Upload OFX Component

## Roteiro de Design

Vou modernizar a funcionalidade de upload OFX para seguir a nova especificação REST, mantendo a compatibilidade com o componente existente. A implementação envolverá:

1. Atualizar o serviço para seguir a nova especificação de API
2. Atualizar o componente para usar o novo endpoint
3. Atualizar a modelagem de dados para se adequar à nova resposta
4. Manter a interface de usuário existente com as funcionalidades

## Requisitos

### Requisitos funcionais:
1. O serviço deve consumir o novo endpoint `/api/contas/upload-ofx`
2. Deve suportar o parâmetro opcional `accountId`
3. Deve processar a nova estrutura de resposta
4. Deve converter os dados para o formato existente para manter a UI
5. A funcionalidade de associação manual deve continuar funcionando
6. A funcionalidade de descarte e remoção por arquivo deve continuar funcionando

### Requisitos não-funcionais:
1. Manter a segurança com autenticação JWT
2. Manter a usabilidade existente
3. Manter a consistência com o padrão do sistema
4. Garantir tratamento adequado de erros

### Critérios de aceitação:
1. O componente deve funcionar com o novo endpoint de API
2. Todos os dados devem ser processados e exibidos corretamente
3. As funcionalidades existentes devem continuar operando normalmente
4. O sistema deve tratar adequadamente erros de validação

## Tarefas

- [ ] Criar especificação em spec/upload-ofx-modernizacao.md
- [ ] Atualizar modelo de transação OFX para suportar nova estrutura
- [ ] Atualizar serviço transacoes-ofx para novo endpoint
- [ ] Atualizar componente para usar nova estrutura de dados
- [ ] Manter compatibilidade com UI existente
- [ ] Testar funcionalidade após as alterações

## Opção de Reversão

Para reverter as alterações, basta restaurar os arquivos:
- `src/app/models/transacao-ofx.model.ts`
- `src/app/services/transacoes-ofx.service.ts`
- `src/app/components/upload-ofx/upload-ofx.component.ts`