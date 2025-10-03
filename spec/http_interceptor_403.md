# Interceptor de Erros HTTP 403

## Roteiro de Design

Implementação de interceptação de erros HTTP 403 (Forbidden) no Angular para automaticamente fazer logout do usuário e redirecionar para a página de login. O interceptor faz parte do sistema de autenticação existente e estende a funcionalidade do AuthInterceptor para tratar situações onde o usuário não tem permissão para acessar um determinado recurso.

## Requisitos

### Requisitos Funcionais
- O sistema deve interceptar todas as respostas HTTP que retornem status 403
- Quando um erro 403 for detectado, o sistema deve automaticamente fazer logout do usuário
- Após o logout, o sistema deve redirecionar o usuário para a página de login
- O comportamento deve ser consistente com o tratamento existente de erros 401

### Requisitos Não-Funcionais
- O interceptor deve ser implementado como parte do sistema de interceptors do Angular
- O código deve seguir as boas práticas e padrões de código do projeto
- O interceptor deve ser eficiente e não impactar negativamente o desempenho da aplicação

### Critérios de Aceitação
- Quando um erro HTTP 403 ocorrer, o usuário é automaticamente deslogado
- O usuário é redirecionado para a página de login correta após o erro 403
- O token de autenticação é removido do armazenamento local
- O estado do usuário no AuthService é atualizado para refletir o logout

## Tarefas

- [x] Analisar o interceptor existente (AuthInterceptor)
- [x] Estender o interceptor para tratar erros HTTP 403
- [x] Verificar o caminho correto para redirecionamento de login
- [x] Atualizar o caminho de redirecionamento para o caminho correto
- [x] Testar a implementação

## Opção de Reversão

Caso seja necessário reverter esta implementação:

1. Reverter as alterações no arquivo `src/app/interceptors/auth.interceptor.ts`
2. Remover o tratamento específico de erros 403 adicionado ao interceptor
3. Restaurar o caminho de redirecionamento anterior, se necessário

Comandos git para reverter:
```bash
git checkout -- src/app/interceptors/auth.interceptor.ts
```