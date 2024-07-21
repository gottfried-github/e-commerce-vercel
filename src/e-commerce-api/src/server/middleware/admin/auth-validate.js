import Ajv from 'ajv'
import { toTree } from 'ajv-errors-to-data-tree'
import * as m from '../../../../../e-commerce-common/messages.js'

// 1 in 'Function'/'inward'
function ensureCredentials(req, res, next) {
  const isName = 'name' in req.body,
    isPassword = 'password' in req.body

  if (isName && isPassword) return next()

  const errors = { errors: [], node: {} }

  if (!isName) {
    errors.node.name = { errors: [m.FieldMissing.create("'name' field is missing")], node: null }
  }

  if (!isPassword) {
    errors.node.password = {
      errors: [m.FieldMissing.create("'password' field is missing")],
      node: null,
    }
  }

  return next(m.ValidationError.create('some credentials are missing', errors))
}

const ajv = new Ajv({ allErrors: true, strictRequired: true })
const _validatePsswd = ajv.compile({
  type: 'string',
  minLength: 8,
  maxLength: 150,
})

// function validatePsswd(psswd) {
//     _validatePsswd(psswd)

//     if (_validatePsswd.errors) return m.ValidationError.create("password is invalid", {errors: [], node: {
//         password: toTree(_validatePsswd.errors, (e) => {
//             if ('type' === e.keyword) return m.TypeErrorMsg.create(e.message, e)
//             if (!['minLength', 'maxLength'].includes(e.keyword)) throw new Error(`Ajv produced unpredictable error: ${e.keyword}`)

//             return m.ValidationError.create(e.message, e)
//         })
//     }})

//     if (psswd.normalize() !== psswd) return m.ValidationError.create("password is invalid", {errors: [], node: {
//         password: {
//             errors: [m.ValidationError.create('normalized version of password differs from original')],
//             node: null
//         }
//     }})

//     return null
// }

export default () => ensureCredentials
