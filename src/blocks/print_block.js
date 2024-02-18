import Blockly, { Block } from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

Blockly.defineBlocksWithJsonArray([
    {
        'type': 'print_block',
        'message0': 'imprime %1',
        'args0': [{
            'type': 'input_value',
            'name': 'VALUE',
            'check': ['String', 'Number', 'Boolean']
        }],
        'previousStatement': null,
        'nextStatement': null,
        'colour': 160,
        'tooltip': 'Mostra o valor definido no console',
        'helpUrl': '',
    }
])

/**
 *
 * @param {!Blockly.Block} block
 * @param {!Blockly.Generator} generator
 * @returns
 */
javascriptGenerator['print_block'] = function (block, generator) {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC)
    return 'console.log(' + value + ')\n'
}