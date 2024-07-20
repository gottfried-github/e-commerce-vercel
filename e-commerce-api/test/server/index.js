import { testHandler } from './error-handler.js'
import { testRoutes } from './auth-routes.js'

import test from './product-validate.js'
import testFilterErrors from './product-helpers.js'

describe('errorHandler', () => {
  testHandler()
})

describe('auth routes', () => {
  testRoutes()
})

describe('validate', () => {
  test()
})

describe('helpers', () => {
  testFilterErrors()
})
