import * as m from '../../../../../../e-commerce-common/messages.js'
import validate from '../../../lib/admin/validate/product/photos-get.js'

export default () => (req, res, next) => {
  const errors = validate(req.body)

  console.log('middleware, photos/get, errors:', errors)

  if (!errors) return next()

  next(m.ValidationError.create('some fields are filled incorrectly', errors.node))
}
