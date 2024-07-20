class Message {
    constructor(code, decorate) {
        if ('number' !== typeof code) throw new TypeError('code must be a number')
        if (decorate && 'function' !== typeof decorate) throw new TypeError('decorate must be a function')

        this.code = code
        // this.message = message || null

        this.create = decorate ? (...args) => {return decorate(new Message(this.code), ...args)} : () => {return new Message(this.code)}
    }
}

// The field is not defined in the spec
const FieldUnknown = new Message(11, (o, message, data) => {
    if (message && 'string' !== typeof message) throw new TypeError('message must be a string')
    o.message = message
    o.data = data
    return o
})

// A required field is missing from the request body
const FieldMissing = new Message(4, (o, message, data) => {
    if (message && 'string' !== typeof message) throw new TypeError('message must be a string')
    o.message = message
    o.data = data
    return o
})

// The type of value, provided in a field is incorrect
const TypeErrorMsg = new Message(3, (o, message, data) => {
    if (message && 'string' !== typeof message) throw new TypeError('message must be a string')
    o.message = message
    o.data = data
    return o
})

// The field exists, the type is correct but the value is empty (e.g., '', [])
const EmptyError = new Message(5, (o, message) => {
    if (message && 'string' !== typeof message) throw new TypeError('message must be a string')
    o.message = message
    return o
})

// The type is correct, the value is not empty, but violates additionally defined validation rules
const ValidationError = new Message(10, (o, message, tree, data) => {
    o.message = message || null
    o.tree = tree || null
    o.data = data || null
    return o
})

const ResourceNotFound = new Message(6, (o, message) => {
    o.message = message
    return o
})

// invalid criterion by which to match data in a search
const InvalidCriterion = new Message(12, (o, message, data) => {
    o.message = message || null
    o.data = data
    return o
})

// i.e., http 409
const ResourceExists = new Message(13, (o, message, tree, data) => {
    o.message = message || null
    o.tree = tree || null
    o.data = data || null
    return o
})

// error format violates the spec, outlined in docs
const InvalidErrorFormat = new Message(8, (o) => {
    o.message = "error format violates specification"
    return o
})

export {
    Message,

    FieldMissing,

    TypeErrorMsg,
    EmptyError,
    ValidationError,
    ResourceNotFound,
    InvalidCriterion,
    ResourceExists,
    FieldUnknown,
    InvalidErrorFormat,
}
