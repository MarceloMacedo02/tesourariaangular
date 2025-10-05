# Upload OFX Component

## Roteiro de Design

O componente upload-ofx.component.html precisa ser reestruturado para seguir o mesmo padrão visual e estrutural do componente socio-importar.component.html. Isso envolve adotar a estrutura de página com `page-content` e `container-fluid` e manter o layout de duas colunas para formulário e instruções ou informações, além de seguir o padrão visual dos cards e tabelas.

## Requisitos

### Requisitos funcionais:
1. O componente deve manter todas as funcionalidades atuais
2. O layout deve seguir o padrão de `socio-importar.component.html`
3. O upload de arquivos OFX deve continuar funcionando
4. A exibição de resultados deve seguir o padrão visual
5. As funcionalidades de associação manual devem continuar funcionando
6. A remoção de transações por arquivo deve continuar funcionando

### Requisitos não-funcionais:
1. Manter a responsividade
2. Preservar a usabilidade
3. Manter a consistência com os outros componentes do sistema
4. Garantir que o código continue limpo e bem estruturado

### Critérios de aceitação:
1. O componente deve seguir o padrão visual do sistema
2. Todas as funcionalidades devem continuar funcionando
3. O layout deve ser consistente com outros componentes de importação
4. O componente deve estar responsivo

## Tarefas

- [x] Criar especificação em spec/upload-ofx.component.md
- [ ] Analisar a estrutura do componente socio-importar para entender o padrão
- [ ] Atualizar o HTML do componente upload-ofx para seguir o padrão
- [ ] Ajustar estilos CSS conforme necessário
- [ ] Manter todas as funcionalidades existentes
- [ ] Testar o componente após as alterações

## Opção de Reversão

Para reverter as alterações, basta restaurar os arquivos:
- `src/app/components/upload-ofx/upload-ofx.component.html`
- `src/app/components/upload-ofx/upload-ofx.component.css` (se alterado)