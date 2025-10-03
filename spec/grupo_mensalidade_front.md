# Implementação de Cadastro de GrupoMensalidade para Frontend Angular

## Roteiro de Design

Implementação da funcionalidade completa de cadastro de GrupoMensalidade no frontend Angular, baseada na API REST existente do backend. A implementação inclui os componentes de listagem e formulário, serviço de dados e integração com o sistema de rotas existente.

## Requisitos

### Requisitos Funcionais
- O sistema deve permitir a listagem paginada de grupos de mensalidade
- O sistema deve permitir a criação de novos grupos de mensalidade
- O sistema deve permitir a edição de grupos de mensalidade existentes
- O sistema deve permitir adicionar e remover itens de rubrica dentro de um grupo
- O sistema deve carregar a lista de rubricas ativas para seleção no formulário
- Os campos de uso exclusivo do backend (dataRegistro, dataAtualizacao, dataCriacao) devem ser tratados adequadamente

### Requisitos Não-Funcionais
- O código deve seguir os padrões e convenções do projeto existente
- A interface deve ser consistente com os outros módulos de cadastro
- A implementação deve usar os componentes e estilos existentes
- O tratamento de erros deve ser consistente com o restante da aplicação

### Critérios de Aceitação
- A página de listagem mostra os grupos de mensalidade com paginação
- O formulário permite criar/editar grupos de mensalidade corretamente
- É possível adicionar itens de rubrica a um grupo de mensalidade
- Os dados são salvos corretamente no backend
- O sistema exibe mensagens de erro apropriadas em caso de falhas

## Tarefas

- [x] Criar modelo de GrupoMensalidade
- [x] Criar serviço de GrupoMensalidade
- [x] Criar componente de listagem
- [x] Criar componente de formulário
- [x] Criar templates HTML para ambos os componentes
- [x] Integrar com o módulo de cadastros
- [x] Configurar as rotas adequadas
- [x] Testar a implementação
- [x] Documentar a implementação

## Opção de Reversão

Caso seja necessário reverter esta implementação:

1. Remover os arquivos criados:
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade.model.ts
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade.service.ts
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade.component.ts
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade.component.html
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade.component.scss
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component.ts
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component.html
   - src/app/pages/cadastros/grupo-mensalidade/grupo-mensalidade-form/grupo-mensalidade-form.component.scss

2. Remover as importações e declarações dos componentes no módulo de cadastros
3. Remover as rotas relacionadas ao GrupoMensalidade no arquivo de rotas

Comandos git para reverter:
```bash
git rm -r src/app/pages/cadastros/grupo-mensalidade/
git checkout -- src/app/pages/cadastros/cadastros.module.ts
git checkout -- src/app/pages/cadastros/cadastros-routing.module.ts
```