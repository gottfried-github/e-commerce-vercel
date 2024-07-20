import { assert } from 'chai'
import * as m from '../../../e-commerce-common/messages.js'
import { Req, Res } from './mocks.js'

import { authenticate } from '../../src/server/routes/admin/auth.js'

function testRoutes() {
  describe('dep resolves with InvalidCriterion', () => {
    it("calls 'next' with the message", async () => {
      let isEqual = false

      await authenticate(
        new Req(),
        new Res(_status => {}),
        msg => {
          isEqual = m.InvalidCriterion.code === msg.code
        },
        {
          authenticate: (req, res, next) => {
            return Promise.resolve(m.InvalidCriterion.create('message'))
          },
        }
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('dep resolves with ResourceNotFound', () => {
    it('assigns 404', async () => {
      let status = null

      await authenticate(
        new Req(),
        new Res(_status => {
          status = _status
        }),
        () => {},
        {
          authenticate: (req, res, next) => {
            return Promise.resolve(m.ResourceNotFound.create('message'))
          },
        }
      )

      assert.strictEqual(status, 404)
    })
  })

  describe('dep resolves with true', () => {
    it('responds using json', async () => {
      let isCalled = false

      await authenticate(
        new Req(),
        new Res(null, () => {
          isCalled = true
        }),
        () => {},
        {
          authenticate: () => {
            return Promise.resolve(true)
          },
        }
      )

      assert.strictEqual(isCalled, true)
    })
  })

  describe('dep rejects with value', () => {
    it("calls 'next' with the value", async () => {
      const value = 'some value'
      let isEqual = false

      await authenticate(
        new Req(),
        new Res(),
        _value => {
          isEqual = value === _value
        },
        {
          authenticate: () => {
            return Promise.reject(value)
          },
        }
      )

      assert.strictEqual(isEqual, true)
    })
  })

  describe('dep resolves with arbitrary value', () => {
    it("calls 'next' with the value", async () => {
      const value = 'some value'
      let isEqual = false

      await authenticate(
        new Req(),
        new Res(),
        _value => {
          isEqual = value === _value
        },
        {
          authenticate: () => {
            return Promise.resolve(value)
          },
        }
      )

      assert.strictEqual(isEqual, true)
    })
  })
}

export { testRoutes }
