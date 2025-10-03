# Adição de Loading e Desabilitação de Botão na Geração de Cobrança de Mensalidade

## Roteiro de Design

Este documento descreve as alterações realizadas para adicionar indicador visual de loading e desabilitação do botão durante a geração de cobrança de mensalidade, evitando múltiplos envios e melhorando a experiência do usuário.

## Requisitos

1. Adicionar spinner de loading no botão de "Gerar Cobranças"
2. Desabilitar o botão durante o processamento
3. Alterar o texto do botão para "Gerando Cobranças..." durante o processamento
4. Prevenir múltiplos envios acidentais
5. Manter a funcionalidade de geração de cobranças intacta

## Componentes Envolvidos

- `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts` - Lógica e template do componente

## Tarefas

- [x] Atualizar o template para adicionar spinner no botão
- [x] Implementar lógica de loading no método de geração de cobranças
- [x] Desabilitar o botão durante o processamento
- [x] Alterar o texto do botão durante o carregamento
- [x] Garantir que o loading seja corretamente ativado e desativado
- [x] Testar a funcionalidade para garantir que tudo funciona corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Atualizações no Template

1. Adicionado spinner Bootstrap no botão de submit:
   ```html
   <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
   ```

2. Atualizado o texto do botão para mudar dinamicamente:
   ```html
   {{ loading ? 'Gerando Cobranças...' : 'Gerar Cobranças' }}
   ```

3. Adicionado a variável loading à condição de disabled:
   ```html
   [disabled]="cobrancaForm.invalid || !sociosSelecionados.length || loading"
   ```

### Atualizações no Método de Geração

1. Adicionado `this.loading = true;` no início do método para ativar o loading
2. Adicionado `this.loading = false;` no sucesso e erro para desativar o loading
3. Mantido a funcionalidade original de geração de cobranças

### Funcionamento

1. Quando o usuário clica no botão "Gerar Cobranças", a variável `loading` é definida como `true`
2. O botão é desabilitado e mostra o spinner de loading
3. O texto do botão muda para "Gerando Cobranças..."
4. Após a conclusão da operação (sucesso ou erro), a variável `loading` é definida como `false`
5. O botão é habilitado novamente e o texto volta a ser "Gerar Cobranças"

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.ts`:
   - No template HTML, remova o spinner e reverta o texto do botão para o original
   - Remova "|| loading" da condição de disabled do botão
   - No método `gerarCobrancas()`, remova as linhas de controle de loading