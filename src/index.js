import * as Blockly from 'blockly'
import toolbox from './toolbox'
import './index.css'
import './plugin/blocks/main_statement'

/**
 * Create a workspace
 * @param {HTMLElement} blockDiv
 * @param {!Blockly.BlocklyOptions} options
 * @returns {Blockly.WorkspaceSvg}
 */
function createWorkspace(blockDiv, options) {
    const ws = Blockly.inject(blockDiv, options)
    Blockly.serialization.workspaces.load(startBlocks, ws)
    return ws
}

const startBlocks = {
    blocks: {
        languageVersion: 0,
        blocks: [
            {
                type: "main_statement",
                x: 20,
                y: 20,
                deletable: false,
                movable: false,
                extraState: {
                    params: [
                        { name: "peso", type: 'number' },
                        { name: "altura", type: 'number' },
                        { name: "nome", type: 'string', value: 'Silas Ribeiro' }
                    ]
                },
            },
        ],
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const defaultOptions = { toolbox }
    createWorkspace(
        document.getElementById('block-editor'),
        defaultOptions
    )
})
