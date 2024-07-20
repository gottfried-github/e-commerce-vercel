import { assert } from 'chai'
import { toTree } from 'ajv-errors-to-data-tree'

import { _validate } from '../../src/server/middleware/admin/product-validate-lib.js'
import filterErrors from '../../src/server/middleware/admin/product-helpers.js'

import { _test } from './product-validate.js'

function testFilterErrors() {
  const tests = {
    exposeRequired: [
      {
        i: [
          (data => {
            _validate(data)
            // console.log("filterErrors tests, exposeRequired, i - data:", data);
            return toTree(_validate.errors)
          })({}),
        ],
        o: errors => {
          filterErrors(errors)
          return errors
        },
        description: 'missing expose and no fields. See 1 in Filtering out irrelevant errors',
      },
    ],
    exposeType: [
      {
        i: [
          (data => {
            _validate(data)
            return toTree(_validate.errors)
          })({ expose: 5 }),
        ],
        o: errors => {
          filterErrors(errors)
          return errors
        },
        description: 'invalid expose and no fields. See 1 in Filtering out irrelevant errors',
      },
    ],
    exposeRequiredNameType: [
      {
        i: [
          (data => {
            _validate(data)
            return toTree(_validate.errors)
          })({ name: 5 }),
        ],
        o: errors => {
          filterErrors(errors)
          return errors
        },
        description: 'missing expose and invalid name. See 1 in Filtering out irrelevant errors',
      },
    ],
    exposeNameType: [
      {
        i: [
          (data => {
            _validate(data)
            return toTree(_validate.errors)
          })({ expose: 5, name: 5 }),
        ],
        o: errors => {
          filterErrors(errors)
          return errors
        },
        description: 'invalid expose and invalid name. See 1 in Filtering out irrelevant errors',
      },
    ],
    nameTypeOthersRequired: [
      {
        i: [
          (data => {
            _validate(data)
            return toTree(_validate.errors)
          })({
            expose: true,
            name: 5,
          }),
        ],
        o: errors => {
          filterErrors(errors)
          return errors
        },
        description: 'true expose and invalid name. See 2 in Filtering out irrelevant errors',
      },
    ],
  }

  _test(tests)
}

export default testFilterErrors
