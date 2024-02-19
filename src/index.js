import * as Blockly from 'blockly'
import toolboxJson from './toolbox'
import locale from 'blockly/msg/pt-br'
import { javascriptGenerator } from 'blockly/javascript'
import { pythonGenerator } from 'blockly/python'
import { luaGenerator } from 'blockly/lua'
import { phpGenerator } from 'blockly/php'
import { dartGenerator } from 'blockly/dart'
import Interpreter from 'js-interpreter'

import './index.css'

document.addEventListener('DOMContentLoaded', createWorkspace)
document.getElementById('playButton').addEventListener('click', execute)
document.getElementById('generateDropdown').addEventListener('change', regenerate)

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
  workspace.addChangeListener(regenerate);
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
  const initFunc = function (interpreter, globalObject) {
    const alertWrapper = function alert(text) {
      return window.alert(arguments.length ? text : '');
    };
    interpreter.setProperty(
      globalObject,
      'alert',
      interpreter.createNativeFunction(alertWrapper),
    );

    const promptWrapper = function prompt(text, defaultValue) {
      return window.prompt(
        arguments.length > 0 ? text : '',
        arguments.length > 1 ? defaultValue : '',
      );
    };
    interpreter.setProperty(
      globalObject,
      'prompt',
      interpreter.createNativeFunction(promptWrapper),
    );
  };

  const code = javascriptGenerator.workspaceToCode(
    Blockly.getMainWorkspace(),
  );
  const myInterpreter = new Interpreter(code, initFunc);
  let stepsAllowed = 10000;
  while (myInterpreter.step() && stepsAllowed) {
    stepsAllowed--;
  }
  if (!stepsAllowed) {
    throw EvalError('Infinite loop.');
  }
}

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
    blocks: [
      {
        type: 'variables_set',
        x: 10,
        y: 10,
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
    ],
  },
  variables: [
    {
      name: 'Count',
      id: 'Count',
    },
  ],
};
