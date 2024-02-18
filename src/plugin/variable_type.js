/**
 * The type of a variable, e.g. 'int', 'string', etc.
 * @enum {string}
 */
export const Types = {
    NUMBER: 'number',
    STRING: 'string',
    BOOLEAN: 'boolean',
}


/**
 * Returns the type of a variable.
 * @param {string} type The type of the variable.
 * @returns {Types}
 */
export function fromString(type) {
    switch (type) {
        case Types.NUMBER:
            return Types.NUMBER
        case Types.STRING:
            return Types.STRING
        case Types.BOOLEAN:
            return Types.BOOLEAN
        default:
            throw new Error(`Unknown type ${type}`)
    }
}