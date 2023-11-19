import Blockly from 'blockly/core'
import * as VariableType from '../variable_type'

delete Blockly.Blocks['main_statement']

Blockly.defineBlocksWithJsonArray([{
    type: 'main_statement',
    style: 'procedure_blocks',
    tooltip: 'Bloco principal para construção da lógica',
    message0: 'Programa %1 %2',
    args0: [
        { type: 'input_dummy', name: 'top' },
        { type: 'input_statement', name: 'stack' }
    ],
    mutator: 'statement_mutator',
}])



const statementMutator = {

    /**
     * Returns the state of this block as a JSON serializable object.
     * @returns {{params: (!Array<{name: string, id: string}>|undefined),
     *     hasStatements: (boolean|undefined)}} The state of this block, eg the
        *     parameters and statements.
        */
    saveExtraState: function () {
        if (!this.argData_.length) {
            return null
        }
        const state = Object.create(null)
        state['params'] = []
        for (const arg of this.argData_) {
            const model = arg?.model
            if (model) {
                state['params'].push({
                    id: model.getId(),
                    name: model.name,
                    type: model.type,
                    value: model.value,
                    argId: arg.argId
                })
            }
        }
        console.log('saveExtraState', this.argData_)
        return state

    },

    /**
     * Applies the given state to this block.
     * @param {*} state The state to apply to this block, eg the parameters and
     *     statements.
     */
    loadExtraState: function (state) {
        const params = state.params.map(({ type, ...opts }) => ({
            ...opts,
            type: VariableType.fromString(type)
        }))

        this.updateShape_(params)
        console.log('loadExtraState', this.argData_)
    },

    /**
     * Adds an argument to the block and updates the block's parallel tracking
     * arrays as appropriate.
     * @param {Object} obj argData object
     * @param {string} obj.name The name of the argument.
     * @param {string} [obj.id] The UUID of the variable associated with the
     * @param {string} [obj.argId] The UUID of the argument (different from var ID).
     * @param {VariableType.Types} obj.type The type of the argument.
     * @param {any} [obj.value] The value of the argument.
     *
     * @this {Blockly.Block}
     * @private
     */
    addArg_: function ({ id, name, type, argId, value }) {
        if (!this.argData_.length) {
            const withField = new Blockly.FieldLabel('com:')
            this.getInput('top').appendField(withField, 'with')
        }
        const argNames = this.argData_.map((elem) => elem.model.name)
        name = name || Blockly.Variables.generateUniqueNameFromOptions(Blockly.Procedures.DEFAULT_ARG, argNames)
        argId = argId || Blockly.utils.idGenerator.genUid()
        this.addInput_(name, argId)

        const variable = Blockly.Variables.getOrCreateVariablePackage(this.workspace, id, name, type)

        this.argData_.push({
            model: variable,
            argId: argId
        })
        console.log('addArg_', this.argData_)
    },

    /**
     * Appends the actual inputs and fields associated with an argument to the
     * block.
     * @param {string} name The name of the argument.
     * @param {string} argId The UUID of the argument (different from var ID).
     * @this {Blockly.Block}
     * @private
     */
    addInput_: function (name, argId) {
        const nameField = new Blockly.FieldLabel(`- ${name}`)
        this.appendDummyInput(argId)
            .setAlign(Blockly.inputs.Align.RIGHT)
            .appendField(nameField, argId)
        this.moveInputBefore(argId, 'stack');
    },

    /**
     * Removes the argument associated with the given argument ID from the block.
     * @param {string} argId An ID used to track arguments on the block.
     * @this {Blockly.Block}
     * @private
     */
    removeArg_: function (argId) {
        if (this.removeInput(argId, true)) {
            if (!this.argData_.length) {
                this.getInput('top').removeField('with')
            }
            this.argData_ = this.argData_.filter(arg => arg.argId !== argId)
        }
        console.log('removeArg_', this.argData_)
    },

    updateShape_: function (params) {
        for (let i = this.argData_.length - 1; i >= 0; i--) {
            this.removeArg_(this.argData_[i].argId)
        }
        this.argData_ = [];
        params.forEach(params => this.addArg_(params))
        console.log('updateShape_', this.argData_)
    },
}

/**
 * Initializes some private variables for procedure blocks.
 * @this {Blockly.Block}
 */
const statementHelper = function () {
    /**
     * An array of objects containing data about the args belonging to the
     * procedure definition.
     * @type {!Array<{
     *          model:Blockly.VariableModel,
        *          argId: string
        *       }>}
        * @private
        */
    this.argData_ = [];
}

Blockly.Extensions.registerMutator('statement_mutator', statementMutator, statementHelper)