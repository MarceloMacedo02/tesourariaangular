# Upload de Arquivo OFX

## Roteiro de Design

Implementação de funcionalidade para upload e processamento de arquivos OFX no frontend Angular. A funcionalidade permitirá ao usuário fazer upload de arquivos OFX do banco, processar as transações neles contidas e associar manualmente transações pendentes a sócios ou fornecedores quando a identificação automática não for possível.

A arquitetura seguirá os princípios de Clean Architecture com separação clara de responsabilidades:
- Componente de upload: Responsável pela interface de usuário e seleção de arquivo
- Serviço de transações OFX: Comunicação com a API backend
- DTOs: Modelos de dados para transações e pendências
- Componente de exibição: Visualização das transações importadas e pendentes

## Requisitos

### Requisitos Funcionais
- RF01: Permitir upload de arquivos OFX
- RF02: Processar arquivo OFX através da API backend
- RF03: Exibir transações creditadas e debitadas após o processamento
- RF04: Exibir transações pendentes que necessitam de associação manual
- RF05: Permitir associação manual de transações pendentes a sócios ou fornecedores
- RF06: Exibir histórico de arquivos importados
- RF07: Permitir remoção de transações associadas a um arquivo específico

### Requisitos Não-Funcionais
- RNF01: Interface responsiva e intuitiva
- RNF02: Tratamento adequado de erros
- RNF03: Validação de formato de arquivo OFX
- RNF04: Autenticação JWT para chamadas à API

### Dependências
- Angular 17+
- Angular Material (para componentes UI)
- Serviço de autenticação JWT existente
- API backend com endpoints OFX

### Critérios de Aceitação
- CA01: Upload de arquivo OFX deve ser realizado com sucesso
- CA02: Transações do arquivo OFX devem ser exibidas corretamente
- CA03: Transações pendentes devem poder ser associadas a sócios/fornecedores
- CA04: Interface deve fornecer feedback adequado durante o processamento

## Tarefas

- [x] Criar especificação para upload de arquivo OFX em spec/upload_ofx.md
- [ ] Analisar estrutura existente do projeto Angular para entender componentes e serviços
- [ ] Criar componente para upload de arquivo OFX
- [ ] Implementar serviço para comunicação com a API de processamento OFX
- [ ] Implementar tratamento de resposta da API e exibição de resultados
- [ ] Adicionar funcionalidade de listagem de transações pendentes
- [ ] Implementar funcionalidade de associação manual de transações pendentes
- [ ] Testar funcionalidade completa de upload e processamento OFX

## Opção de Reversão

Para reverter as alterações implementadas:

1. Remover os arquivos criados:
   - src/app/components/upload-ofx/upload-ofx.component.ts
   - src/app/components/upload-ofx/upload-ofx.component.html
   - src/app/components/upload-ofx/upload-ofx.component.css
   - src/app/services/transacoes-ofx.service.ts
   - src/app/models/transacao-ofx.model.ts

2. Remover importações e declarações dos novos componentes/serviços nos módulos correspondentes

3. Remover as rotas adicionadas para a funcionalidade de upload OFX

4. Executar `git checkout -- .` para reverter quaisquer modificações em arquivos existentes