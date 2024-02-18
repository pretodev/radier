import * as Blockly from 'blockly'
import toolbox from './toolbox'
import locale from 'blockly/msg/pt-br'
import { javascriptGenerator } from 'blockly/javascript'

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

import './index.css'
import './plugin/blocks/main_statement'
import './plugin/generators/main_statement'
import 'highlight.js/styles/atom-one-dark.css';
import './blocks/print_block'


/**
 * Create a workspace
 * @param {HTMLElement} blockDiv
 * @param {!Blockly.BlocklyOptions} options
 * @returns {Blockly.WorkspaceSvg}
 */
function createWorkspace(blockDiv, options) {
    Blockly.setLocale(locale)
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

const codeViewEl = document.getElementById('app-code-view')

hljs.registerLanguage('javascript', javascript);

document
    .addEventListener('DOMContentLoaded', function () {
        const defaultOptions = { toolbox }
        createWorkspace(
            document.getElementById('block-editor'),
            defaultOptions
        )
    })

document
    .getElementById('generate-code')
    .addEventListener('change', function (event) {
        const language = event.target.value
        const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace())
        codeViewEl.innerHTML = hljs.highlight(code, { language: 'javascript' }).value
    })