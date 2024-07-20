import createError from 'http-errors'
import * as m from '../../../../e-commerce-common/messages.js'

function _errorHandler(e, req, res, next) {
  if (!e) return next()

  console.log('errorHandler, e:', e)

  if (e instanceof m.Message) {
    if (m.ValidationError.code === e.code || m.InvalidCriterion.code === e.code)
      return res.status(400).json(e)
    if (m.ResourceExists.code === e.code) return res.status(409).json(e)

    if (m.ResourceNotFound.code === e.code) return res.status(404).json(e)
  }

  // bodyParser generates these
  if (e instanceof createError.HttpError) {
    // somehow isHttpError is not a function...
    // if (createError.isHttpError(e)) {
    return res.status(e.status).json(e)
  }

  if (e instanceof Error) {
    // req.log("handleApiErrors, an instance of Error occured, the instance:", e)
    return res.status(500).json({ message: e.message })
  }

  return res.status(500).json({ message: 'something went wrong' })
}

function errorHandler(e, req, res, next) {
  return _errorHandler(e, req, res, next)
}

function errorHandlerFactory() {
  return errorHandler
}

export { errorHandlerFactory as default, _errorHandler }
