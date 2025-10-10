# Upload OFX Component

## Roteiro de Design

Implementar funcionalidade para upload de arquivos OFX na API com endpoint POST em `/api/ofx/importar`. O componente permitirá aos usuários selecionar e enviar arquivos OFX, processar as transações e exibir os resultados classificados como créditos, débitos e transações pendentes. O endpoint retorna uma resposta detalhada com as transações processadas e metadados.

### Componentes envolvidos:
1. Service para comunicação com a API
2. Componente Angular para interface de upload
3. Modelo para representar a resposta da API

### Arquitetura proposta:
- Utilizar o componente existente UploadOfxComponent
- Atualizar o service e modelo para lidar com a nova resposta da API
- Implementar o método de upload para chamar o endpoint /api/ofx/importar
- Configurar o serviço para usar a URL base da API a partir do ambiente

## Requisitos

### Requisitos Funcionais:
1. Permitir o upload de arquivos OFX
2. Processar o upload para o endpoint /api/ofx/importar
3. Exibir os resultados do processamento (créditos, débitos, pendentes)
4. Manipular as transações pendentes com opções de associação manual

### Requisitos Não-Funcionais:
1. Interface segura e amigável
2. Tratamento adequado de erros
3. Validação de formato de arquivo OFX
4. Feedback visual durante o processo de upload
5. Uso da URL base da API configurada no ambiente

### Critérios de Aceitação:
1. O upload deve ser feito com sucesso para o endpoint especificado
2. A resposta da API deve ser corretamente mapeada e exibida
3. Deve haver validação de formato de arquivo OFX
4. A interface deve fornecer feedback adequado durante o processo
5. Deve usar a URL base da API configurada nos arquivos de ambiente

## Tarefas

- [x] Criar arquivo de especificação em spec/upload-ofx-component.md
- [x] Atualizar modelo de transação OFX para refletir a resposta da API
- [x] Implementar método no service para upload OFX
- [x] Atualizar componente para usar o endpoint correto
- [x] Testar funcionalidade de upload
- [x] Validar resposta da API e exibição correta
- [x] Configurar o serviço para usar a URL base da API a partir do ambiente
- [x] Melhorar o tratamento de erros para fornecer mensagens mais informativas

## Opção de Reversão

Para desfazer as alterações:
1. Excluir o arquivo spec/upload-ofx-component.md
2. Reverter as alterações no service transacoes-ofx.service.ts
3. Reverter as alterações no modelo transacao-ofx.model.ts
4. Reverter as alterações no modelo transacao-response.model.ts
5. Reverter as alterações no componente upload-ofx.component.ts e .html
6. Verificar se o componente retorna ao estado anterior com git status e git checkout se necessário