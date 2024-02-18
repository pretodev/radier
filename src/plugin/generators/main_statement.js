import Blockly from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'


/**
 *
 * @param {!Blockly.Block} block
 * @param {!Blockly.Generator} generator
 * @returns
 */
javascriptGenerator.forBlock['main_statement'] = function (block, generator) {
    const statement = generator.statementToCode(block, 'stack')
    console.log(block.saveExtraState())
    return `
(function () {
    ${statement.trim()}
})()`.trim()
}