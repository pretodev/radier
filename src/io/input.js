const validTypes = ['num', 'txt', 'bool']

export function fromString(str) {
    const lines = str.split('\n')
    const types = []
    for (const l of lines) {
        const [name, type, value] = l.split(' ')
        if (!name || !type) {
            throw new InvalidInputError('Invalid input')
        }
        if (!validTypes.includes(type)) {
            throw new InvalidInputError('Invalid type')
        }
        if (value && !isValueType(value, type)) {
            throw new InvalidInputError('Invalid value')
        }
        types.push({ name, type, value })
    }
    return types
}

function isValueType(value, type) {
    if (type === 'num') {
        return !isNaN(value)
    }
    if (type === 'bool') {
        return value === 'true' || value === 'false'
    }
    return true
}

class InvalidInputError extends Error {
    constructor(message) {
        super(message)
        this.name = 'InvalidInputError'
    }
}


