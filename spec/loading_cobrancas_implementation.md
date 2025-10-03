# Implementação de Loading nas Atividades de Cobranças

## Roteiro de Design

Este documento descreve as alterações realizadas para adicionar indicadores visuais de loading nas operações de criação de cobranças (individual e em lote), proporcionando melhor feedback ao usuário durante as operações assíncronas.

### Componentes Atualizados

1. **NonMonthlyBillingIndividualComponent** (`src/app/pages/cadastros/cobrancas/individual/non-monthly-billing-individual.component.ts`)
2. **NonMonthlyBillingBatchComponent** (`src/app/pages/cadastros/cobrancas/batch/non-monthly-billing-batch.component.ts`)

## Requisitos

1. Adicionar indicador visual de loading durante a criação de cobranças individuais
2. Adicionar indicador visual de loading durante a criação de cobranças em lote
3. Manter a funcionalidade de desabilitar o botão durante o processamento
4. Manter os textos informativos durante o carregamento

## Tarefas

- [x] Adicionar spinner ao botão de criação de cobrança individual
- [x] Adicionar spinner ao botão de criação de cobrança em lote
- [x] Manter a lógica existente de desabilitar o botão durante o processamento
- [x] Manter os textos informativos durante o carregamento
- [x] Testar se a funcionalidade de loading está funcionando corretamente

## Detalhes da Implementação

### Componente Individual

Adicionado um spinner Bootstrap ao botão de submit quando a operação de criação de cobrança está em andamento:

```html
<button 
  type="submit" 
  class="btn btn-primary w-100" 
  [disabled]="billingForm.invalid || loading">
  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
  {{ loading ? 'Gerando Cobrança...' : 'Gerar Cobrança de Outras Rubricas' }}
</button>
```

### Componente em Lote

Adicionado um spinner Bootstrap ao botão de submit quando a operação de criação de cobranças em lote está em andamento:

```html
<button 
  type="submit" 
  class="btn btn-primary w-100" 
  [disabled]="billingForm.invalid || !sociosSelecionados.length || loading">
  <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
  {{ loading ? 'Gerando Cobranças...' : 'Gerar Cobranças em Lote de Outras Rubricas' }}
</button>
```

### Funcionamento

1. Quando o usuário clica no botão de criação de cobrança, a variável `loading` é definida como `true`
2. O spinner é exibido e o botão é desabilitado
3. O texto do botão muda para indicar que a operação está em andamento
4. Após a conclusão da operação (sucesso ou erro), a variável `loading` é definida como `false`
5. O spinner é ocultado e o botão é habilitado novamente

## Opção de Reversão

Para reverter as alterações:

1. Remover o elemento `<span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>` de ambos os componentes
2. Deixar apenas o texto original no botão de submit

Os commits anteriores podem ser usados para restaurar o estado anterior caso necessário.