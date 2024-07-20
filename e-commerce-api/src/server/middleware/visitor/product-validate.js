import * as m from '../../../../../e-commerce-common/messages.js'
import _validate from './product-validate-lib.js'

function validate(req, res, next) {
  const errors = _validate(req.body)
  if (errors) return next(m.ValidationError.create('some fields are filled incorrectly', errors))

  return next()
}

export default () => validate
