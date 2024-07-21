import Ajv from 'ajv'
import { toTree } from 'ajv-errors-to-data-tree'

import * as m from '../../../../../../../e-commerce-common/messages.js'

import objectIdSchema from '../../../objectId-schema.js'

const ajv = new Ajv({ allErrors: true, strictRequired: true })

const schema = {
  type: 'object',
  properties: {
    productId: objectIdSchema,
    photosIds: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 1,
      },
    },
  },
  required: ['productId', 'photosIds'],
  additionalProperties: false,
}

const _validate = ajv.compile(schema)

function validate(photoIds) {
  if (_validate(photoIds)) return false

  const errors = toTree(_validate.errors, e => {
    if ('required' === e.keyword) return m.FieldMissing.create(e.message, e)
    if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)

    return m.ValidationError.create(e.message, null, e)
  })

  return errors
}

export { validate as default, _validate }
