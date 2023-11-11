import * as Blockly from 'blockly'
import './index.css'
import * as input from './io/input'
import toolbox from './toolbox'

// elements
const blocklyDiv = document.getElementById('block-editor')
const inputEditor = document.getElementById('input-editor')

// blockly setup
const ws = Blockly.inject(blocklyDiv, { toolbox })

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