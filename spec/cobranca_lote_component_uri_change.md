# Alteração de URI no Componente de Cobrança em Lote

## Roteiro de Design

Este documento descreve a alteração necessária no componente de cobrança em lote para mudar a URI base da API de `/api/socios/cobrancas` para `/api/cobrancas`. Essa alteração afeta o serviço `SocioService`, especificamente o método `gerarCobrancasMensalidade`, que atualmente usa a URL `${this.apiUrl}/cobrancas/salvar-mensalidade` onde `this.apiUrl` é `${environment.apiBaseUrl}/api/socios`.

## Requisitos

- O método `gerarCobrancasMensalidade` no serviço `SocioService` deve passar a usar a URI base `/api/cobrancas` em vez de `/api/socios/cobrancas`
- A funcionalidade de geração de cobranças em lote deve continuar funcionando normalmente após a alteração
- O endpoint deve ser `/api/cobrancas/salvar-mensalidade` após a alteração

## Tarefas

- [x] Identificar o método no SocioService que precisa da alteração de URI
- [x] Criar este documento de especificação
- [ ] Modificar o método `gerarCobrancasMensalidade` para usar a nova URI base `/api/cobrancas`
- [ ] Verificar se a alteração está correta

## Opção de Reversão

Para reverter esta alteração, basta restaurar a linha no método `gerarCobrancasMensalidade` no arquivo `src/app/pages/cadastros/socio/socio.service.ts` para o valor original que usa a URI `${this.apiUrl}/cobrancas/salvar-mensalidade`.