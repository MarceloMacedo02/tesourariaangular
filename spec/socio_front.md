# Implementação de Cadastro de Sócios para Frontend Angular

## Roteiro de Design

Implementação da funcionalidade completa de cadastro de Sócios no frontend Angular, baseada na API REST existente do backend. A implementação inclui os componentes de listagem e formulário, serviço de dados e integração com o sistema de rotas existente.

## Requisitos

### Requisitos Funcionais
- O sistema deve permitir a listagem paginada de sócios
- O sistema deve permitir a criação de novos sócios
- O sistema deve permitir a edição de sócios existentes
- O sistema deve exibir campos para informações pessoais, profissionais e familiares
- O sistema deve permitir selecionar grau de sócio, status e grupo de mensalidade
- Os campos de uso exclusivo do backend (dataRegistro, dataAtualizacao) devem ser tratados adequadamente

### Requisitos Não-Funcionais
- O código deve seguir os padrões e convenções do projeto existente
- A interface deve ser consistente com os outros módulos de cadastro
- A implementação deve usar os componentes e estilos existentes
- O tratamento de erros deve ser consistente com o restante da aplicação

### Critérios de Aceitação
- A página de listagem mostra os sócios com paginação
- O formulário permite criar/editar sócios corretamente
- Os dados são salvos corretamente no backend
- O sistema exibe mensagens de erro apropriadas em caso de falhas
- O menu sidebar contém o link para o cadastro de sócios

## Tarefas

- [x] Criar modelo de Sócio
- [x] Criar serviço de Sócio
- [x] Criar componente de listagem
- [x] Criar componente de formulário
- [x] Criar templates HTML para ambos os componentes
- [x] Integrar com o módulo de cadastros
- [x] Configurar as rotas adequadas
- [x] Adicionar link ao menu sidebar
- [x] Testar a implementação

## Opção de Reversão

Caso seja necessário reverter esta implementação:

1. Remover os arquivos criados:
   - src/app/pages/cadastros/socio/socio.model.ts
   - src/app/pages/cadastros/socio/socio.service.ts
   - src/app/pages/cadastros/socio/socio.component.ts
   - src/app/pages/cadastros/socio/socio.component.html
   - src/app/pages/cadastros/socio/socio.component.scss
   - src/app/pages/cadastros/socio/socio-form/socio-form.component.ts
   - src/app/pages/cadastros/socio/socio-form/socio-form.component.html
   - src/app/pages/cadastros/socio/socio-form/socio-form.component.scss

2. Remover as importações e declarações dos componentes no módulo de cadastros
3. Remover as rotas relacionadas a sócios no arquivo de rotas
4. Remover o link de sócios do menu sidebar

Comandos git para reverter:
```bash
git rm -r src/app/pages/cadastros/socio/
git checkout -- src/app/pages/cadastros/cadastros.module.ts
git checkout -- src/app/pages/cadastros/cadastros-routing.module.ts
git checkout -- src/app/layouts/sidebar/menu.ts
```