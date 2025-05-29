import * as Blockly from 'blockly'
import toolboxJson from './toolbox'
import * as locale from 'blockly/msg/pt-br'
import { javascriptGenerator } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import { luaGenerator } from 'blockly/lua'
import { phpGenerator } from 'blockly/php'
import { dartGenerator } from 'blockly/dart'
import Interpreter from 'js-interpreter'

import './main_statement'
import * as Console from './console'
import './index.css'
import { DisableTopBlocks } from './disable_top_blocks'

let currentInterpreter = null;
let isExecuting = false;
let userInputs = [];

document.addEventListener('DOMContentLoaded', createWorkspace)
document.getElementById('playButton').addEventListener('click', () => {
  Console.clear()
  execute()
})
document.getElementById('stopButton').addEventListener('click', () => {
  stopExecution()
})

// Input management event listeners
document.getElementById('addInputButton').addEventListener('click', openInputModal)
document.getElementById('closeModal').addEventListener('click', closeInputModal)
document.getElementById('cancelInput').addEventListener('click', closeInputModal)
document.getElementById('confirmInput').addEventListener('click', addInput)

// Close modal when clicking outside
document.getElementById('inputModal').addEventListener('click', (e) => {
  if (e.target.id === 'inputModal') {
    closeInputModal()
  }
})
// document.getElementById('generateDropdown').addEventListener('change', regenerate)

Console.attach('console-content')



/**
 * Initialize the page once everything is loaded.
 */
function createWorkspace() {
  Blockly.setLocale(locale)

  // Inject localized category names.
  toolboxJson['contents'][0].name = 'Lógica';
  toolboxJson['contents'][1].name = 'Laços';
  toolboxJson['contents'][2].name = 'Matemática';
  toolboxJson['contents'][3].name = 'Texto';
  toolboxJson['contents'][4].name = 'Listas';
  toolboxJson['contents'][5].name = 'Cor';
  // Separator.
  toolboxJson['contents'][7].name = 'Variáveis';
  toolboxJson['contents'][8].name = 'Funções';

  // Inject default variable name.
  // https://github.com/google/blockly/issues/5238
  let toolboxString = JSON.stringify(toolboxJson);
  toolboxString = toolboxString.replace(
    /%\{BKY_VARIABLES_DEFAULT_NAME\}/g,
    Blockly.Msg.VARIABLES_DEFAULT_NAME,
  );
  const toolbox = JSON.parse(toolboxString);

  // Inject Blockly.
  const workspace = Blockly.inject('blocklyDiv', {
    toolbox,
    renderer: 'thrasos',
    zoom: {
      maxScale: 1.4,
      minScale: 0.1,
      scaleSpeed: 1,
      // pinch: true,
    },
    trashcan: false,
    theme: Blockly.Theme.defineTheme('modest', {
      fontStyle: {
        family: 'Google Sans',
        weight: 'bold',
        size: 16,
      },
      blockStyles: {
        logic_blocks: {
          colourPrimary: '#D1C4E9',
          colourSecondary: '#EDE7F6',
          colorTertiary: '#B39DDB',
        },
        loop_blocks: {
          colourPrimary: '#A5D6A7',
          colourSecondary: '#E8F5E9',
          colorTertiary: '#66BB6A',
        },
        math_blocks: {
          colourPrimary: '#2196F3',
          colourSecondary: '#1E88E5',
          colorTertiary: '#0D47A1',
        },
        text_blocks: {
          colourPrimary: '#FFCA28',
          colourSecondary: '#FFF8E1',
          colorTertiary: '#FF8F00',
        },
        list_blocks: {
          colourPrimary: '#4DB6AC',
          colourSecondary: '#B2DFDB',
          colorTertiary: '#009688',
        },
        colour_blocks: {
          colourPrimary: '#FFCDD2',
          colourSecondary: '#FFEBEE',
          colorTertiary: '#EF9A9A',
        },
        variable_blocks: {
          colourPrimary: '#EF9A9A',
          colourSecondary: '#FFEBEE',
          colorTertiary: '#EF5350',
        },
        variable_dynamic_blocks: {
          colourPrimary: '#EF9A9A',
          colourSecondary: '#FFEBEE',
          colorTertiary: '#EF5350',
        },
        procedure_blocks: {
          colourPrimary: '#D7CCC8',
          colourSecondary: '#EFEBE9',
          colorTertiary: '#BCAAA4',
        },
      },
    }),
    grid: {
      spacing: 25,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
  });
  Blockly.serialization.workspaces.load(startBlocks, workspace);

  workspace.addChangeListener(Blockly.Events.disableOrphans);

  // The plugin must be initialized before it has any effect.
  const disableTopBlocksPlugin = new DisableTopBlocks();
  disableTopBlocksPlugin.init();
  
  // workspace.addChangeListener(regenerate);
}

/**
 * Regenerate the blocks into a (computer) language.
 * Called when the blocks change, or when the target language changes.
 * @param _e
 */
function regenerate(_e) {
  if (Blockly.getMainWorkspace().isDragging()) {
    return; // Don't update code mid-drag.
  }
  const generateLang = _e.target?.value ?? 'javascript';
  const generator = generators[generateLang];
  const playButton = document.getElementById('playButton');
  playButton.style.display = generateLang === 'javascript' ? 'block' : 'none';
  const code = generator.workspaceToCode(Blockly.getMainWorkspace());
  const codeHolder = document.getElementById('codeHolder');
  codeHolder.innerHTML = ''; // Delete old code.
  codeHolder.classList.remove('prettyprinted');
  codeHolder.appendChild(document.createTextNode(code));
  if (typeof PR === 'object') {
    PR.prettyPrint();
  }
}


/**
 * Generate JavaScript from the blocks, then execute it using JS-Interpreter.
 */
function execute() {
  if (isExecuting) {
    return; // Prevent multiple executions
  }

  isExecuting = true;
  updateButtonVisibility();

  const initFunc = function(interpreter, globalObject) {
    // Define uma função assíncrona personalizada para o prompt
    const promptWrapper = function(text, callback) {
      text = text ? text.toString() : '';
      Console.input(text).then(response => {
        callback(response);
      });
    };

    // Configura o prompt como uma função assíncrona no interpretador
    interpreter.setProperty(globalObject, 'prompt', interpreter.createAsyncFunction(promptWrapper));

    // Configura o alert de forma síncrona, pois não requer operações assíncronas
    const alertWrapper = function(text) {
      text = text ? text.toString() : '';
      Console.print(text);
    };
    interpreter.setProperty(globalObject, 'alert', interpreter.createNativeFunction(alertWrapper));
    
    // Add user inputs to global scope
    userInputs.forEach(input => {
      interpreter.setProperty(globalObject, input.name, interpreter.nativeToPseudo(input.value));
    });
  };

  const code = javascriptGenerator.workspaceToCode(Blockly.getMainWorkspace());
  currentInterpreter = new Interpreter(code, initFunc);

  function nextStep() {
    try {
      if (currentInterpreter && isExecuting && currentInterpreter.step()) {
        setTimeout(nextStep, 0);
      } else {
        // Execution finished or stopped
        stopExecution();
      }
    } catch (e) {
      console.error(e);
      stopExecution();
    }
  }

  nextStep();
}

/**
 * Stop the current execution.
 */
function stopExecution() {
  if (currentInterpreter) {
    currentInterpreter = null;
  }
  isExecuting = false;
  updateButtonVisibility();
}

function updateButtonVisibility() {
  const playButton = document.getElementById('playButton');
  const stopButton = document.getElementById('stopButton');
  
  if (isExecuting) {
    playButton.style.display = 'none';
    stopButton.style.display = 'flex';
  } else {
    playButton.style.display = 'flex';
    stopButton.style.display = 'none';
  }
}

// Input Management Functions
function openInputModal() {
  const modal = document.getElementById('inputModal');
  const inputName = document.getElementById('inputName');
  const inputType = document.getElementById('inputType');
  
  // Reset form
  inputName.value = '';
  inputType.value = 'text';
  
  modal.style.display = 'block';
  inputName.focus();
}

function closeInputModal() {
  const modal = document.getElementById('inputModal');
  modal.style.display = 'none';
}

function addInput() {
  const inputName = document.getElementById('inputName').value.trim();
  const inputType = document.getElementById('inputType').value;
  
  if (!inputName) {
    alert('Por favor, digite um nome para a entrada.');
    return;
  }
  
  // Check if input name already exists
  if (userInputs.find(input => input.name === inputName)) {
    alert('Já existe uma entrada com este nome.');
    return;
  }
  
  const inputData = {
    id: Date.now().toString(),
    name: inputName,
    type: inputType,
    value: getDefaultValue(inputType)
  };
  
  userInputs.push(inputData);
  renderInputs();
  closeInputModal();
}

function getDefaultValue(type) {
  switch (type) {
    case 'text': return '';
    case 'number': return 0;
    case 'boolean': return false;
    default: return '';
  }
}

function removeInput(inputId) {
  userInputs = userInputs.filter(input => input.id !== inputId);
  renderInputs();
}

function renderInputs() {
  const container = document.getElementById('inputsContainer');
  container.innerHTML = '';
  
  userInputs.forEach(input => {
    const inputItem = document.createElement('div');
    inputItem.className = 'input-item';
    
    let inputElement;
    if (input.type === 'boolean') {
      inputElement = `<select onchange="updateInputValue('${input.id}', this.value)">
        <option value="false" ${!input.value ? 'selected' : ''}>Falso</option>
        <option value="true" ${input.value ? 'selected' : ''}>Verdadeiro</option>
      </select>`;
    } else {
      const inputType = input.type === 'number' ? 'number' : 'text';
      inputElement = `<input type="${inputType}" value="${input.value}" 
        onchange="updateInputValue('${input.id}', this.value)" 
        oninput="updateInputValue('${input.id}', this.value)">`;
    }
    
    inputItem.innerHTML = `
      <label>${input.name}:</label>
      ${inputElement}
      <button class="remove-input" onclick="removeInput('${input.id}')">Remover</button>
    `;
    
    container.appendChild(inputItem);
  });
}

function updateInputValue(inputId, value) {
  const input = userInputs.find(input => input.id === inputId);
  if (input) {
    if (input.type === 'number') {
      input.value = parseFloat(value) || 0;
    } else if (input.type === 'boolean') {
      input.value = value === 'true';
    } else {
      input.value = value;
    }
  }
}

// Make functions globally accessible
window.updateInputValue = updateInputValue;
window.removeInput = removeInput;

/**
 * Object containing generators for different programming languages.
 * @type {Object.<string, Function>}
 */
const generators = {
  'javascript': javascriptGenerator,
  'python': pythonGenerator,
  'lua': luaGenerator,
  'php': phpGenerator,
  'dart': dartGenerator,
}

/**
 * Initial blocks when loading page.
 */
const startBlocks = {
  blocks: {
    languageVersion: 0,
    blocks: [{
      type: 'main_statement',
      x: 10,
      y: 10,
      deletable: false,
      next: {
        block: {
          type: 'variables_set',
          fields: {
            VAR: { id: 'Count' },
          },
          inputs: {
            VALUE: {
              block: {
                type: 'math_number',
                fields: { NUM: 1 },
              },
            },
          },
          next: {
            block: {
              type: 'controls_whileUntil',
              fields: { MODE: 'WHILE' },
              inputs: {
                BOOL: {
                  block: {
                    type: 'logic_compare',
                    fields: { OP: 'LTE' },
                    inputs: {
                      A: {
                        block: {
                          type: 'variables_get',
                          fields: {
                            VAR: { id: 'Count' },
                          },
                        },
                      },
                      B: {
                        block: {
                          type: 'math_number',
                          fields: { NUM: 3 },
                        },
                      },
                    },
                  },
                },
                DO: {
                  block: {
                    type: 'text_print',
                    inputs: {
                      TEXT: {
                        block: {
                          type: 'text',
                          fields: { TEXT: 'Hello World!' },
                        },
                      },
                    },
                    next: {
                      block: {
                        type: 'variables_set',
                        fields: {
                          VAR: { id: 'Count' },
                        },
                        inputs: {
                          VALUE: {
                            block: {
                              type: 'math_arithmetic',
                              fields: { OP: 'ADD' },
                              inputs: {
                                A: {
                                  block: {
                                    type: 'variables_get',
                                    fields: {
                                      VAR: { id: 'Count' },
                                    },
                                  },
                                },
                                B: {
                                  block: {
                                    type: 'math_number',
                                    fields: { NUM: 1 },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    ],
  },
  variables: [
    {
      name: 'Count',
      id: 'Count',
    },
  ],
};
