# Igualar Conteúdo da Aba Mensalidades à Aba Outras Rubricas

## Roteiro de Design

Este documento descreve as alterações necessárias para igualar o conteúdo da aba "Mensalidades" ao conteúdo da aba "Outras Rubricas" na tela de edição de transações de crédito.

A interface que será modificada é a transações de crédito editar, localizada em `src/app/pages/financeiro/transasoes/transacoes-credito/transacoes-credito-editar/`.

A alteração consiste em tornar o conteúdo da aba "Mensalidades" idêntico ao da aba "Outras Rubricas", mantendo as mesmas estruturas HTML e lógica de negócios.

## Requisitos

### Requisitos Funcionais
- A aba "Mensalidades" deve ter exatamente o mesmo conteúdo que a aba "Outras Rubricas"
- Ambas as abas devem manter sua funcionalidade de seleção de cobranças
- Os totais selecionados devem continuar funcionando corretamente para cada aba
- A estrutura visual das duas abas deve ser idêntica

### Requisitos Não-Funcionais
- A alteração não deve afetar as outras abas (Contas a Receber)
- O desempenho da página não deve ser afetado
- A alteração deve seguir as boas práticas de desenvolvimento Angular
- A alteração deve manter a responsividade da interface

### Critérios de Aceitação
- Ambas as abas "Mensalidades" e "Outras Rubricas" apresentam a mesma estrutura visual
- As funcionalidades de seleção múltipla funcionam corretamente em ambas as abas
- Os cálculos de totais selecionados funcionam corretamente em ambas as abas
- Não há impacto nas outras funcionalidades da página

## Tarefas

- [ ] Analisar a estrutura atual das abas
- [ ] Modificar o template HTML para igualar as abas
- [ ] Verificar se a lógica do componente precisa de ajustes
- [ ] Testar as funcionalidades após a alteração
- [ ] Validar visualização em diferentes tamanhos de tela

## Opção de Reversão

Para reverter esta alteração, basta restaurar o conteúdo original da aba "Mensalidades" no template HTML, revertendo as mudanças no arquivo `src/app/pages/financeiro/transasoes/transacoes-credito/transacoes-credito-editar/transacoes-credito-editar.component.html`.

Se estiver usando Git, pode-se executar:
```bash
git checkout HEAD -- src/app/pages/financeiro/transasoes/transacoes-credito/transacoes-credito-editar/transacoes-credito-editar.component.html
```