import { assert } from 'chai'
import createError from 'http-errors'
import * as m from '../../../e-commerce-common/messages.js'

import { Req, Res } from './mocks.js'

import { _errorHandler } from '../../src/server/middleware/error-handler.js'

function testHandler() {
  describe('passed HttpError', () => {
    it('assigns same code as in error', () => {
      const status = 400,
        e = createError(400)
      let isEqual = false

      _errorHandler(
        e,
        new Req(),
        new Res(_status => {
          isEqual = status === _status
        }),
        () => {}
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('passed ValidationError', () => {
    it('assigns 400', () => {
      const status = 400
      let isEqual = false

      _errorHandler(
        m.ValidationError.create('message'),
        new Req(),
        new Res(_status => {
          isEqual = status === _status
        }),
        () => {},
        {
          isValidBadInputTree: () => true,
        }
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('passed ResourceExists', () => {
    it('assigns 409', () => {
      const status = 409
      let isEqual = false

      _errorHandler(
        m.ResourceExists.create('message'),
        new Req(),
        new Res(_status => {
          isEqual = status === _status
        }),
        () => {},
        {
          isValidBadInputTree: () => true,
        }
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('passed an Error', () => {
    it('assigns 500', () => {
      const status = 500
      let isEqual = false

      _errorHandler(
        new Error(),
        new Req(),
        new Res(_status => {
          isEqual = status === _status
        }),
        () => {}
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('passed arbitrary value', () => {
    it('assigns 500', () => {
      const status = 500
      let isEqual = false

      _errorHandler(
        {},
        new Req(),
        new Res(_status => {
          isEqual = status === _status
        }),
        () => {}
      )

      assert.strictEqual(isEqual, true)
    })
  })
}

export { testHandler }
