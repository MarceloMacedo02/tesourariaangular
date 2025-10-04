# Contas a Pagar - Módulo Financeiro

## Roteiro de Design

Implementação do módulo de contas a pagar dentro do módulo financeiro do sistema. O módulo inclui funcionalidades para criação, listagem, edição e pagamento de contas a pagar, seguindo os mesmos padrões arquiteturais e de organização de código já estabelecidos no projeto.

### Componentes envolvidos

1. **contas-a-pagar.service.ts** - Serviço para comunicação com a API de contas a pagar
2. **contas-a-pagar-listar.component.ts** - Componente para listagem de contas a pagar
3. **contas-a-pagar-form.component.ts** - Componente para criação/edição de contas a pagar
4. **contas-a-pagar-detalhes.component.ts** - Componente para visualização de detalhes
5. **contas-a-pagar-pagamento.component.ts** - Componente para registro de pagamento
6. **financeiro-routing.module.ts** - Atualizado para incluir rotas de contas a pagar
7. **financeiro.module.ts** - Atualizado para incluir componentes de contas a pagar

### Arquitetura proposta

A arquitetura implementada segue o padrão estabelecido pelo módulo de cadastros:

1. Subdiretório em `/src/app/pages/financeiro/contas-a-pagar/` para os componentes específicos
2. Arquivo de serviço (`contas-a-pagar.service.ts`) para operações com a API
3. Componentes reutilizáveis seguindo os padrões existentes
4. Uso de formulários reativos para criação/edição
5. Tabelas para listagem com formatação adequada

### Possíveis desafios

1. Integração com a API existente de contas a pagar
2. Garantir consistência com os dados de fornecedores e rubricas
3. Implementação do registro de pagamento com controle de status
4. Tratamento de datas e formatação de valores monetários

## Requisitos

### Requisitos funcionais

1. Criar componente para listagem de contas a pagar (GET /api/contas-a-pagar)
2. Criar componente para detalhes de uma conta a pagar específica (GET /api/contas-a-pagar/{id})
3. Criar componente para criação de novas contas a pagar (POST /api/contas-a-pagar/salvar)
4. Criar componente para edição de contas a pagar existentes
5. Implementar funcionalidade para registrar pagamento (POST /api/contas-a-pagar/registrar-pagamento/{id})
6. Exibir status atual da conta (ABERTA, PAGA, CANCELADA)
7. Validar dados obrigatórios nos formulários
8. Exibir informações de fornecedor e rubrica associadas

### Requisitos não-funcionais

1. Manter consistência com o código existente
2. Seguir os padrões de codificação do projeto
3. Utilizar os mesmos imports e estrutura que os módulos existentes
4. Manter a separação de responsabilidades
5. Garantir usabilidade e experiência consistente com o restante do sistema
6. Tratamento adequado de erros e mensagens para o usuário
7. Internacionalização (i18n) onde apropriado

### Dependências

1. Angular Core
2. Angular Router
3. Angular Forms (reactive forms)
4. Angular Common (CurrencyPipe, DatePipe)
5. NgSelectModule para seleção de fornecedores e rubricas
6. FlatpickrModule para seleção de datas
7. NgxCurrencyDirective para formatação monetária
8. Serviço de autenticação e AuthGuard
9. API backend com endpoints para contas a pagar

### Critérios de aceitação

1. Componente de listagem exibindo todas as contas a pagar com informações completas
2. Componente de criação funcionando corretamente com validação de campos
3. Componente de edição permitindo atualização de contas existentes
4. Funcionalidade de registro de pagamento alterando o status da conta corretamente
5. Integração completa com a API conforme especificações fornecidas
6. Interface consistente com os padrões do sistema

## Tarefas

- [x] Atualizar roteiro de design para incluir contas a pagar
- [x] Atualizar requisitos para incluir contas a pagar
- [x] Criar componentes para contas a pagar
- [x] Atualizar módulo e roteamento para incluir contas a pagar
- [x] Atualizar especificações em spec/contas-a-pagar.md
- [x] Fornecer opção de reversão

## Opção de Reversão

Para reverter estas alterações, você pode:

1. Remover os arquivos criados:
   ```
   rm src/app/pages/financeiro/contas-a-pagar/contas-a-pagar.service.ts
   rm src/app/pages/financeiro/contas-a-pagar/contas-a-pagar-listar.component.ts
   rm src/app/pages/financeiro/contas-a-pagar/contas-a-pagar-form.component.ts
   rm src/app/pages/financeiro/contas-a-pagar/contas-a-pagar-detalhes.component.ts
   rm src/app/pages/financeiro/contas-a-pagar/contas-a-pagar-pagamento.component.ts
   rm src/app/pages/financeiro/spec/contas-a-pagar.md
   ```

2. Remover o diretório contas-a-pagar se estiver vazio:
   ```
   rmdir src/app/pages/financeiro/contas-a-pagar/
   ```

3. Reverter as alterações nos arquivos de módulo e roteamento:
   - Em `src/app/pages/financeiro/financeiro-routing.module.ts`, remover as importações e rotas relacionadas a contas a pagar
   - Em `src/app/pages/financeiro/financeiro.module.ts`, remover as importações e declarações relacionadas a contas a pagar

4. Se houver referências a estas funcionalidades em outros arquivos do sistema, remova-as também.