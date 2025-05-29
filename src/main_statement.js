import * as Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

delete Blockly.Block['main_statement']

Blockly.defineBlocksWithJsonArray([{
  type: 'main_statement',
  style: 'procedure_blocks',
  message0: 'Quando clicar em Executar',
  nextStatement: null,
  tooltip: "Bloco de início: conecte os blocos que devem ser executados ao clicar em executar",
}])

javascriptGenerator.forBlock['main_statement'] = function(block, generator) {
  return `// Início da execução\n`
}


export class DisableTopBlocks {
  init() {
    const disableMenuItem = Blockly.ContextMenuRegistry.registry.getItem('blockDisable');
    this.oldPreconditionFn = disableMenuItem.preconditionFn;
    disableMenuItem.preconditionFn = function (scope) {
      const block = scope.block;
      if (!block.isInFlyout && block.workspace.options.disable && block.isEditable()) {
        if (block.getInheritedDisabled() || isNotConnectedToMainStatement(block)) {
          return 'disabled';
        }
        return 'enabled';
      }
      return 'hidden';
    };
  }

  dispose() {
    const disableMenuItem = Blockly.ContextMenuRegistry.registry.getItem('blockDisable');
    disableMenuItem.preconditionFn = this.oldPreconditionFn;
  }
}

function isNotConnectedToMainStatement(block) {
  if (block.type === 'main_statement' || block.type === 'function_definition') {
    // Bloco main_statement ou uma definição de função sempre deve ser ativo.
    return false;
  }

  // Verifica se o bloco atual está, de alguma forma, conectado ao bloco main_statement.
  let current = block;
  while (current) {
    if (current.type === 'main_statement') {
      return false; // Conectado ao main_statement.
    }
    current = current.getParent();
  }

  // Se o bloco não está conectado ao main_statement, considera-se 'órfão'.
  return true;
}