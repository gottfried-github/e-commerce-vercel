import { traverseTree } from 'ajv-errors-to-data-tree/src/helpers.js'

function _parseFirstOneOfItemPath(schemaPath) {
  const nodeNames = schemaPath.split('/')
  if (0 === nodeNames[0].length) nodeNames.shift()

  let oneOfI = null

  for (const [i, name] of nodeNames.entries()) {
    if ('oneOf' === name) {
      oneOfI = i
      break
    }
  }

  if (null === oneOfI) return oneOfI

  const oneOfPath = nodeNames.slice(0, oneOfI + 2).reduce((str, nodeName, i) => {
    str += `/${nodeName}`
    return str
  }, '')

  return oneOfPath
}

function filterErrors(errors) {
  // 1, 1.2 in Filtering out irrelevant errors
  const exposeErr = errors.node.expose?.errors.find(
    e => 'required' === e.data.keyword || 'type' === e.data.keyword
  )

  if (exposeErr) {
    traverseTree(errors, (e, fieldname) => {
      // 1.1, 1.2, 1.3 in Filtering out irrelevant errors
      if (
        _parseFirstOneOfItemPath(exposeErr.data.schemaPath) ===
          _parseFirstOneOfItemPath(e.data.schemaPath) ||
        ('required' === e.data.keyword && 'expose' !== fieldname) ||
        'enum' === e.data.keyword
      )
        return null
    })

    return
  }

  // 2 in Filtering out irrelevant errors

  const redundantSchemas = []

  // store the schema of the 'enum' error
  traverseTree(errors, e => {
    if ('enum' === e.data.keyword) redundantSchemas.push(e.data.schemaPath)
  })

  const redundantOneOfSchemas = redundantSchemas.map(v => _parseFirstOneOfItemPath(v))

  // console.log("filterErrors, redundantSchemas:", redundantSchemas, JSON.stringify(errors, null, 2));

  // exclude the schemas that have the 'enum' error
  traverseTree(errors, e => {
    if (redundantOneOfSchemas.includes(_parseFirstOneOfItemPath(e.data.schemaPath))) return null
  })

  return
}

export default filterErrors
