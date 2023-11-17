import * as Blockly from 'blockly'
import toolbox from './toolbox'
import '@blockly/block-plus-minus'
import * as input from './io/input'
import { buildMainBlock } from './blocks/main'
import './index.css'

// elements
const blocklyDiv = document.getElementById('block-editor')
const inputEditor = document.getElementById('input-editor')

// blockly setup
const ws = Blockly.inject(blocklyDiv, { toolbox })
const mainBlock = buildMainBlock(ws)
console.log(mainBlock)

// events
inputEditor.addEventListener('input', (event) => {
    try {
        inputEditor.classList.remove('error')
        const content = event.target.value
        if (!content) {
            return
        }
        const types = input.fromString(content)
        console.log(types)
    } catch (e) {
        inputEditor.classList.add('error')
    }
})