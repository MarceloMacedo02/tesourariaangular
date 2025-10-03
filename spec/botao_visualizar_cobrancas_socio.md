# Adição de Botão para Visualizar Cobranças de Cada Sócio

## Roteiro de Design

Este documento descreve as alterações realizadas para adicionar um botão na lista de sócios que permite visualizar as cobranças associadas a cada sócio.

## Requisitos

1. Adicionar botão "Visualizar Cobranças" na lista de ações de cada sócio
2. Criar componente para exibir as cobranças de um sócio específico
3. Adicionar rota para acessar a página de cobranças do sócio
4. Implementar serviço para obter as cobranças de um sócio específico
5. Manter a funcionalidade existente intacta

## Componentes Envolvidos

- `src/app/pages/cadastros/socio/socio.component.html` - Adição do botão na lista de sócios
- `src/app/pages/cadastros/cobrancas/socio-billings/socio-billings.component.ts` - Novo componente para visualizar cobranças
- `src/app/pages/cadastros/cobrancas/non-monthly-billing.service.ts` - Serviço com método para obter cobranças do sócio
- `src/app/pages/cadastros/cadastros-routing.module.ts` - Adição da rota para o novo componente
- `src/app/pages/cadastros/cadastros.module.ts` - Declaração do novo componente

## Tarefas

- [x] Adicionar botão "Visualizar Cobranças" na lista de sócios
- [x] Criar componente `SocioBillingsComponent` para exibir as cobranças
- [x] Adicionar método `getBillingsBySocioId` no serviço de cobranças
- [x] Adicionar rota para acessar a página de cobranças do sócio
- [x] Declarar o novo componente no módulo de cadastros
- [x] Testar a funcionalidade para garantir que as cobranças são exibidas corretamente
- [x] Documentar as alterações realizadas

## Detalhes da Implementação

### Adição do Botão na Lista de Sócios

1. Adicionado botão com ícone de lista de arquivos na coluna de ações:
   ```html
   <li class="list-inline-item">
     <a [routerLink]="/pages/cobrancas/socio/{{ socio.id }}" class="btn btn-soft-info btn-sm" title="Visualizar Cobranças">
       <i class="ri-file-list-fill align-bottom"></i>
     </a>
   </li>
   ```

### Novo Componente de Cobranças do Sócio

1. Criado componente `SocioBillingsComponent` que:
   - Recebe o ID do sócio via parâmetro de rota
   - Carrega as informações do sócio
   - Carrega as cobranças associadas ao sócio
   - Exibe as informações em uma tabela formatada
   - Inclui tratamento de erros e estado de carregamento

2. Recursos do componente:
   - Exibição das informações básicas do sócio
   - Tabela com todas as cobranças do sócio
   - Formatação de valores monetários
   - Exibição de datas formatadas
   - Indicadores visuais de status das cobranças
   - Tratamento de erros e estado de carregamento

### Serviço de Cobranças

1. Adicionado método `getBillingsBySocioId` no serviço:
   ```typescript
   getBillingsBySocioId(socioId: number): Observable<Cobranca[]> {
     return this.http.get<Cobranca[]>(`${this.apiUrl}/socio/${socioId}`);
   }
   ```

### Roteamento

1. Adicionada rota para o novo componente:
   ```typescript
   {
     path: 'cobranca/socio/:id',
     component: SocioBillingsComponent,
     canActivate: [AuthGuard]
   }
   ```

## Funcionamento

1. Na lista de sócios, cada registro tem um botão "Visualizar Cobranças"
2. Ao clicar no botão, o usuário é redirecionado para a página de cobranças do sócio
3. A página carrega as informações do sócio e suas cobranças associadas
4. As cobranças são exibidas em uma tabela com informações detalhadas
5. O usuário pode voltar à lista de sócios a qualquer momento

## Opção de Reversão

Para reverter as alterações:

1. No arquivo `src/app/pages/cadastros/socio/socio.component.html`, remova o botão de "Visualizar Cobranças"
2. Remova o diretório `src/app/pages/cadastros/cobrancas/socio-billings/`
3. No arquivo `src/app/pages/cadastros/cobrancas/non-monthly-billing.service.ts`, remova o método `getBillingsBySocioId`
4. No arquivo `src/app/pages/cadastros/cadastros-routing.module.ts`, remova a rota do componente `SocioBillingsComponent`
5. No arquivo `src/app/pages/cadastros/cadastros.module.ts`, remova a declaração do componente `SocioBillingsComponent`