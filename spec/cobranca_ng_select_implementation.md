# Implementação de ng-select nas Cobranças

## Roteiro de Design

Este documento descreve as alterações realizadas para implementar o ng-select nas telas de cobrança com o objetivo de padronizar o comportamento dos campos de seleção de rúbricas e melhorar a experiência do usuário.

### Componentes Atualizados

1. **NonMonthlyBillingBatchComponent** (`src/app/pages/cadastros/cobrancas/batch/non-monthly-billing-batch.component.ts`)
   - Substituição do select tradicional por ng-select para seleção de rúbricas
   - Implementação de currencyMask para formato monetário "R$ 0,00"
   - Atualização do input de data para usar datapicker com placeholder "dd/mm/aaaa"

## Requisitos

1. Substituir os selects tradicionais por ng-select nas telas de cobrança
2. Manter consistência com o padrão já existente em outros componentes
3. Aplicar formato monetário "R$ 0,00" com currencyMask
4. Implementar datapicker para campos de data
5. Manter todas as validações funcionando corretamente

## Tarefas

- [x] Atualizar o componente NonMonthlyBillingBatchComponent para usar ng-select no lugar do select tradicional para seleção de rúbricas
- [x] Atualizar o input de valor no componente NonMonthlyBillingBatchComponent para usar currencyMask com formato "R$ 0,00"
- [x] Atualizar o input de data no componente NonMonthlyBillingBatchComponent para usar datapicker
- [x] Verificar se há outros componentes de cobrança que precisam de ajustes
- [x] Verificar que o componente NonMonthlyBillingIndividualComponent já estava com o padrão correto

## Detalhes da Implementação

### Substituição do Select por ng-select

O select tradicional:
```html
<select 
  class="form-control" 
  id="rubricaId" 
  formControlName="rubricaId" 
  [disabled]="loadingRubricas"
  required>
  <option value="">Selecione uma rubrica</option>
  <option *ngFor="let rubrica of rubricas" [value]="rubrica.id">
    {{ rubrica.nome }}
  </option>
</select>
```

Foi substituído por:
```html
<ng-select 
  [(ngModel)]="selectedRubricaId"
  [disabled]="loadingRubricas"
  [clearable]="false"
  [searchable]="true"
  [closeOnSelect]="true"
  placeholder="Selecione uma rubrica"
  [items]="rubricas"
  bindValue="id"
  bindLabel="nome"
  (change)="onRubricaChange($event)">
</ng-select>
```

### Adição de Variável de Controle

Adicionado a propriedade `selectedRubricaId` no componente:
```typescript
selectedRubricaId: number | null = null;
```

### Atualização do Método de Processamento

O método `generateBatchBillings()` foi atualizado para usar o `selectedRubricaId` ao invés do valor do formControl.

### Implementação do currencyMask

O input de valor foi atualizado para usar currencyMask com o formato "R$ 0,00":
```html
<input 
  type="text" 
  class="form-control" 
  id="valor"
  formControlName="valor"
  [disabled]="loading"
  required
  placeholder="R$ 0,00"
  [currencyMask]="{ prefix: 'R$ ', thousands: '.', decimal: ',', allowNegative: false, nullable: true, precision: 2 }">
```

### Atualização do Input de Data

O input de data foi atualizado para usar a diretiva mwlFlatpickr conforme padrão do projeto:
```html
<input 
  type="text"
  class="form-control"
  id="dataVencimento"
  formControlName="dataVencimento"
  [disabled]="loading"
  placeholder="dd/mm/aaaa"
  mwlFlatpickr
  [altInput]="true"
  [convertModelValue]="true"
  [dateFormat]="'Y-m-d'"
  altFormat="d/m/Y">
```

Ambos os componentes (individual e batch) foram atualizados para usar o datapicker com a diretiva mwlFlatpickr.

## Opção de Reversão

Para reverter as alterações:

1. Substituir o ng-select pelo select tradicional no template do componente NonMonthlyBillingBatchComponent
2. Remover a propriedade `selectedRubricaId` do componente
3. Remover o método `onRubricaChange`
4. Atualizar o método `generateBatchBillings` para usar novamente o valor do formControl
5. Reverter o input de valor para o tipo number e removendo o currencyMask
6. Reverter o input de data para o tipo date

Os commits anteriores podem ser usados para restaurar o estado anterior caso necessário.