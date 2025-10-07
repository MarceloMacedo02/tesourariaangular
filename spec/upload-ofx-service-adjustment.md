# Upload OFX Service Adjustment

## Roteiro de Design

Este ajuste foi realizado para corrigir a incompatibilidade entre a estrutura de resposta esperada pelo serviço `TransacoesOfxService` e a estrutura real retornada pela API. A API agora retorna uma estrutura com `{ resultado: { ... }, message: '...' }` em vez da estrutura `OfxUploadResponse` original.

## Requisitos

- [ ] Atualizar o serviço para lidar com a nova estrutura de resposta da API
- [ ] Manter compatibilidade com a estrutura antiga, se necessário
- [ ] Validar corretamente os dados retornados da API
- [ ] Garantir que o componente continue funcionando corretamente após as alterações

## Tarefas

- [x] Criar nova interface para a estrutura de resposta da API
- [x] Atualizar o serviço para lidar com a nova estrutura de resposta
- [x] Modificar o método importarOFX para tratar ambas as estruturas de resposta
- [x] Atualizar o modelo para incluir a nova interface
- [x] Testar se o componente está funcionando corretamente

## Opção de Reversão

Caso seja necessário reverter as alterações:

1. Restaurar o método `importarOFX` no serviço `TransacoesOfxService` para usar a tipagem original `OfxUploadResponse`
2. Reverter as alterações no modelo `transacao-ofx.model.ts` para remover a interface `ApiResponseStructure`
3. Atualizar os imports conforme necessário