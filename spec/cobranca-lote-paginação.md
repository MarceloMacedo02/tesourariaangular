# CobrancaLoteComponent - Paginação

## Roteiro de Design

A tarefa consistiu em mover o combobox de seleção de quantidade de itens por página da seção de paginação no rodapé para o card superior da página de geração de cobranças de sócios. Isso melhora a experiência do usuário, permitindo que ele ajuste a quantidade de itens exibidos antes de interagir com a tabela.

## Requisitos

- O combobox de quantidade de itens por página deve estar no card superior
- A seleção da quantidade deve ser aplicada imediatamente à tabela
- A funcionalidade existente de paginação deve continuar funcionando
- O combobox deve estar associado à lógica existente de paginação

## Tarefas

- [x] Identificar seção onde estava o combobox atual
- [x] Mover combobox para o card superior
- [x] Garantir que a seleção de quantidade de itens por página seja aplicada imediatamente à tabela
- [x] Implementar alterações no template HTML
- [x] Verificar se a lógica do componente TypeScript já estava implementada
- [x] Testar funcionalidade após implementação

## Opção de Reversão

Para reverter as alterações, basta restaurar o arquivo `src/app/pages/cadastros/socio/cobranca-lote/cobranca-lote.component.html` para o estado anterior antes das alterações. A lógica do componente TypeScript permaneceu inalterada, então o comportamento anterior pode ser restaurado simplesmente movendo o combobox de volta para a seção de paginação no rodapé do template.