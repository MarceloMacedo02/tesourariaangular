# Cadastro de Fornecedores

## Roteiro de Design

Este documento descreve a implementação do cadastro de fornecedores no sistema de tesouraria. O módulo foi desenvolvido seguindo o mesmo padrão arquitetural e estrutural do cadastro de sócios já existente no sistema, assegurando consistência e facilidade de manutenção.

O cadastro de fornecedores permite:
- Cadastro de novos fornecedores com informações completas
- Edição de fornecedores existentes
- Listagem com paginação e filtro
- Exclusão de fornecedores
- Validação de dados obrigatórios e formato adequado

## Requisitos

### Requisitos Funcionais
1. CRUD completo para fornecedores (criar, ler, atualizar, deletar)
2. Validação de dados obrigatórios e formatos de CPF/CNPJ, email e telefone
3. Paginação na listagem de fornecedores
4. Filtro de fornecedores
5. Integração com o backend via API REST

### Requisitos Não-Funcionais
1. Manutenção do padrão arquitetural do sistema
2. Reutilização de componentes existentes
3. Validação dos dados no frontend e backend
4. Integração com sistema de autenticação

### Dependências
1. Backend com endpoints de fornecedores
2. Angular 14+
3. Bibliotecas de UI já utilizadas no projeto
4. Sistema de autenticação e autorização

### Critérios de Aceitação
1. Funcionalidades de CRUD funcionando corretamente
2. Validações de dados implementadas e funcionando
3. Integração com backend realizada com sucesso
4. Padrões de código do projeto seguidos
5. Componentes reutilizáveis e testáveis

## Tarefas

- [x] Analisar a estrutura de pastas e arquivos de socio para entender o padrão a ser seguido
- [x] Criar a estrutura de pastas para fornecedores seguindo o padrão de socio
- [x] Criar o model de fornecedor baseado no DTO do backend
- [x] Criar o serviço de fornecedor com as chamadas para o backend
- [x] Criar o componente de listagem de fornecedores
- [x] Criar o componente de formulário de fornecedor
- [x] Criar o componente principal de fornecedores com navegação
- [x] Implementar as validações de formulário para o cadastro de fornecedores
- [x] Testar todas as funcionalidades de cadastro, edição e listagem de fornecedores

## Opção de Reversão

Para reverter esta implementação, é necessário:

1. Remover os arquivos criados:
   - src/app/pages/cadastros/fornecedor/fornecedor.model.ts
   - src/app/pages/cadastros/fornecedor/fornecedor.service.ts
   - src/app/pages/cadastros/fornecedor/fornecedor.module.ts
   - src/app/pages/cadastros/fornecedor/fornecedor-routing.module.ts
   - src/app/pages/cadastros/fornecedor/fornecedor.component.ts
   - src/app/pages/cadastros/fornecedor/fornecedor.component.html
   - src/app/pages/cadastros/fornecedor/fornecedor.component.scss
   - src/app/pages/cadastros/fornecedor/fornecedor-form/fornecedor-form.component.ts
   - src/app/pages/cadastros/fornecedor/fornecedor-form/fornecedor-form.component.html
   - src/app/pages/cadastros/fornecedor/fornecedor-form/fornecedor-form.component.scss
   - src/app/pages/cadastros/fornecedor/fornecedor-listar/fornecedor-listar.component.ts

2. Remover a importação e declaração do FornecedorModule no arquivo src/app/pages/cadastros/cadastros.module.ts

3. Remover a rota de fornecedores do arquivo src/app/pages/cadastros/cadastros-routing.module.ts

4. Executar testes para garantir que nenhuma funcionalidade existente foi afetada