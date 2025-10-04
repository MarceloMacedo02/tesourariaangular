# Cobranças Avulsas - Módulo Financeiro

## Roteiro de Design

Implementação do módulo de cobranças avulsas dentro do módulo financeiro do sistema. O módulo inclui funcionalidades para criação, listagem, edição e pagamento de cobranças avulsas, seguindo os mesmos padrões arquiteturais e de organização de código já estabelecidos no projeto.

### Componentes envolvidos

1. **cobrancas-avulsas.service.ts** - Serviço para comunicação com a API de cobranças avulsas
2. **cobrancas-avulsas-listar.component.ts** - Componente para listagem de cobranças
3. **cobrancas-avulsas-form.component.ts** - Componente para criação/edição de cobranças avulsas
4. **cobrancas-avulsas-detalhes.component.ts** - Componente para visualização de detalhes
5. **cobrancas-avulsas-pagamento.component.ts** - Componente para registro de pagamento
6. **financeiro-routing.module.ts** - Atualizado para incluir rotas de cobranças avulsas
7. **financeiro.module.ts** - Atualizado para incluir componentes de cobranças avulsas
8. **menu.ts** - Atualizado para incluir link no sidebar

### Arquitetura proposta

A arquitetura implementada segue o padrão estabelecido pelos módulos existentes:

1. Subdiretório em `/src/app/pages/financeiro/cobrancas-avulsas/` para os componentes específicos
2. Arquivo de serviço (`cobrancas-avulsas.service.ts`) para operações com a API
3. Componentes reutilizáveis seguindo os padrões existentes
4. Uso de formulários reativos para criação/edição
5. Tabelas para listagem com formatação adequada

### Possíveis desafios

1. Integração com a API existente de cobranças
2. Garantir consistência com os dados de sócios e fornecedores
3. Implementação do registro de pagamento com controle de status
4. Tratamento de datas e formatação de valores monetários

## Requisitos

### Requisitos funcionais

1. Criar componente para listagem de cobranças (GET /api/cobrancas)
2. Criar componente para detalhes de uma cobrança específica (GET /api/cobrancas/{id})
3. Criar componente para criação de novas cobranças avulsas (POST /api/cobrancas/salvar-avulsa)
4. Criar componente para edição de cobranças avulsas existentes
5. Implementar funcionalidade para registrar pagamento (POST /api/cobrancas/registrar-pagamento/{id})
6. Exibir status atual da cobrança (ABERTA, PAGA, CANCELADA)
7. Validar dados obrigatórios nos formulários
8. Validar que pelo menos sócio ou fornecedor seja informado
9. Exibir informações de sócios e fornecedores associados

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
5. NgSelectModule para seleção de sócios e fornecedores
6. FlatpickrModule para seleção de datas
7. NgxCurrencyDirective para formatação monetária
8. Serviço de autenticação e AuthGuard
9. API backend com endpoints para cobranças

### Critérios de aceitação

1. Componente de listagem exibindo todas as cobranças com informações completas
2. Componente de criação funcionando corretamente com validação de campos
3. Componente de edição permitindo atualização de cobranças existentes
4. Funcionalidade de registro de pagamento alterando o status da cobrança corretamente
5. Integração completa com a API conforme especificações fornecidas
6. Interface consistente com os padrões do sistema
7. Link acessível no menu lateral do sistema

## Tarefas

- [x] Criar o serviço de cobranças avulsas
- [x] Criar componente de listagem de cobranças
- [x] Criar componente de formulário para cobranças avulsas
- [x] Criar componente de detalhes de cobrança
- [x] Criar componente para registro de pagamento
- [x] Atualizar roteamento e módulo financeiro
- [x] Atualizar menu do sidebar
- [x] Adicionar especificações

## Opção de Reversão

Para reverter estas alterações, você pode:

1. Remover os arquivos criados:
   ```
   rm src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas.service.ts
   rm src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas-listar.component.ts
   rm src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas-form.component.ts
   rm src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas-detalhes.component.ts
   rm src/app/pages/financeiro/cobrancas-avulsas/cobrancas-avulsas-pagamento.component.ts
   ```

2. Remover o diretório cobrancas-avulsas se estiver vazio:
   ```
   rmdir src/app/pages/financeiro/cobrancas-avulsas/
   ```

3. Reverter as alterações nos arquivos de módulo e roteamento:
   - Em `src/app/pages/financeiro/financeiro-routing.module.ts`, remover as importações e rotas relacionadas a cobranças avulsas
   - Em `src/app/pages/financeiro/financeiro.module.ts`, remover as importações e declarações relacionadas a cobranças avulsas
   - Em `src/app/layouts/sidebar/menu.ts`, remover os itens de menu adicionados

4. Se houver referências a estas funcionalidades em outros arquivos do sistema, remova-as também.