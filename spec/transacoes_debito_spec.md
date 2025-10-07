# Transações de Débito

## Roteiro de Design

Implementar funcionalidade para gerenciar transações de débito no módulo financeiro, incluindo:
1. Lista de transações de débito com filtros por mês e ano
2. Exibição de informações do fornecedor associado
3. Integração com a API existente de transações detalhadas

## Requisitos

### Requisitos Funcionais
- RF001: Listar transações de débito com filtros por mês e ano
- RF002: Permitir paginação das transações listadas
- RF003: Exibir detalhes das transações (data, descrição, valor, fornecedor, categoria, cobranças)
- RF004: Navegar para o componente de baixa de transação
- RF005: Exibir feedback de carregamento durante as requisições

### Requisitos Não-Funcionais
- RNF001: Interface responsiva e intuitiva
- RNF002: Integração com os endpoints da API existentes
- RNF003: Segurança: proteger as rotas com AuthGuard

### Dependências
- Backend com endpoints para transações detalhadas
- Serviço Angular existente: TransacoesOfxService
- Modelo TypeScript para transações detalhadas (atualizado com fornecedor)

### Critérios de Aceitação
- CA001: Filtragem por mês e ano deve funcionar corretamente
- CA002: As informações do fornecedor devem ser exibidas para transações de débito
- CA003: Interface deve refletir os dados atualizados após cada requisição
- CA004: Componente deve estar acessível via menu de navegação

## Tarefas

- [x] Criar componente para listar transações de débito com filtro mês/ano
- [x] Atualizar rotas em financeiro-routing.module.ts para incluir TransacoesDebitoComponent
- [x] Atualizar menu para incluir link para transações de débito
- [x] Testar funcionalidade completa de transações de débito

## Implementação

### Componente de Listagem (TransacoesDebitoComponent)
- Utiliza o serviço TransacoesOfxService
- Faz requisições para `/api/transacoes-detalhadas` com parâmetros: mes, ano, tipo=DEBITO
- Filtro por mês/ano com paginação
- Exibe informações do fornecedor associado
- Botão "Dar Baixa" para cada transação

### Estrutura de Rotas
- `/financeiro/transacoes/debito` - Componente de listagem de transações de débito

### Modelo de Dados Atualizado
- TransacaoDetalhada: Agora inclui a propriedade `fornecedor` opcional para transações de débito
- Fornecedor: Contém id e nome do fornecedor associado à transação de débito

## Opção de Reversão

Para reverter as alterações:
1. Remover o componente:
   - `src/app/pages/financeiro/transacoes-debito/`
2. Remover a entrada de rota no arquivo `financeiro-routing.module.ts`
3. Remover a referência no módulo `financeiro.module.ts`
4. Remover a entrada no menu em `src/app/layouts/sidebar/menu.ts`
5. Reverter a atualização do modelo `transacao-detalhada.model.ts` removendo o campo fornecedor
6. Remover o arquivo de especificação: `spec/transacoes_debito_spec.md`