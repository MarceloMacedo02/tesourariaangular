# Transações de Crédito

## Roteiro de Design

Implementar funcionalidade para gerenciar transações de crédito no módulo financeiro, incluindo:
1. Lista de transações de crédito com filtros por mês e ano
2. Componente para dar baixa nas transações selecionadas
3. Integração com a API existente de transações detalhadas

## Requisitos

### Requisitos Funcionais
- RF001: Listar transações de crédito com filtros por mês e ano
- RF002: Permitir paginação das transações listadas
- RF003: Exibir detalhes das transações (data, descrição, valor, sócio, categoria, cobranças)
- RF004: Permitir dar baixa (quitação) em transações de crédito
- RF005: Navegar entre a lista e o componente de baixa
- RF006: Exibir feedback de sucesso/erro durante as operações

### Requisitos Não-Funcionais
- RNF001: Interface responsiva e intuitiva
- RNF002: Integração com os endpoints da API existentes
- RNF003: Segurança: proteger as rotas com AuthGuard

### Dependências
- Backend com endpoints para transações detalhadas
- Serviços Angular existentes: TransacoesOfxService e TransacoesService
- Modelos TypeScript para transações detalhadas

### Critérios de Aceitação
- CA001: Filtragem por mês e ano deve funcionar corretamente
- CA002: Ação de baixa deve atualizar o status da transação no backend
- CA003: Interface deve refletir os dados atualizados após ação de baixa
- CA004: Componentes devem estar acessíveis via menu de navegação

## Tarefas

- [x] Criar componente para listar transações de crédito com filtro mês/ano
- [x] Criar serviço para consumir a API de transações detalhadas
- [x] Implementar filtro por mês e ano
- [x] Criar componente para dar baixa nas transações
- [x] Atualizar financeiro.module e router com novas rotas
- [x] Testar funcionalidade completa

## Implementação

### Componente de Listagem (TransacoesCreditoComponent)
- Utiliza o serviço TransacoesOfxService
- Faz requisições para `/api/transacoes-detalhadas` com parâmetros: mes, ano, tipo=CREDITO
- Filtro por mês/ano com paginação
- Botão "Dar Baixa" para cada transação

### Componente de Baixa (BaixaTransacaoComponent)
- Recebe ID da transação via parâmetro de rota
- Carrega dados da transação específica
- Implementa a funcionalidade de quitação via TransacoesService.quitarTransacao()
- Exibe feedback de sucesso/erro
- Redireciona após ação de baixa

### Estrutura de Rotas
- `/financeiro/transacoes/credito` - Componente de listagem
- `/financeiro/transacoes/baixa/:id` - Componente de baixa

### Modelos de Dados
- TransacaoDetalhada: Contém dados da transação (id, data, descricao, valor, tipo, categoria, socio, cobrancas)
- CobrancaDetalhe: Detalhes das cobranças (tipoCobranca, valor, quantidade)
- TransacaoDetalhadaPage: Estrutura paginada com metadados de paginação

## Opção de Reversão

Para reverter as alterações:
1. Remover os componentes:
   - `src/app/pages/financeiro/transacoes-credito/`
   - `src/app/pages/financeiro/baixa-transacao/`
2. Remover as entradas de rota no arquivo `financeiro-routing.module.ts`
3. Remover as referências no módulo `financeiro.module.ts`
4. Remover a entrada no menu em `src/app/layouts/sidebar/menu.ts`
5. Remover o arquivo de especificação: `spec/transacoes_credito_spec.md`