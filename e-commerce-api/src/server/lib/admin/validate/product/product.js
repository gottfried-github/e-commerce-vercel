import Ajv from 'ajv'
import { toTree } from 'ajv-errors-to-data-tree'

import * as m from '../../../../../../../e-commerce-common/messages.js'

import filterErrors from '../../helpers.js'

const ajv = new Ajv({ allErrors: true, strictRequired: true })

const rest = {
  name: { type: 'string', minLength: 3, maxLength: 150 },
  price: { type: 'number', minimum: 0, maximum: 1000000 },
  is_in_stock: { type: 'boolean' },
  description: { type: 'string', minLength: 1, maxLength: 15000 },
  time: { type: 'number', minimum: -86e14, maximum: 86e14 },
}

const schema = {
  oneOf: [
    {
      type: 'object',
      properties: {
        expose: { type: 'boolean', enum: [true] },
        ...rest,
      },
      required: ['expose', 'name', 'price', 'is_in_stock', 'description', 'time'],
      additionalProperties: false,
    },
    {
      type: 'object',
      properties: {
        expose: { type: 'boolean', enum: [false] },
        ...rest,
      },
      required: ['expose'],
      additionalProperties: false,
    },
  ],
}

const _validate = ajv.compile(schema)

function validate(fields) {
  if (_validate(fields)) return false

  const errors = toTree(_validate.errors, e => {
    if ('required' === e.keyword) return m.FieldMissing.create(e.message, e)
    if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)

    return m.ValidationError.create(e.message, null, e)
  })

  filterErrors(errors)

  return errors
}

export { validate as default, _validate }
