// 1 and 2 in 'Function'/'inward'
// see "Throwing TypeError in validateCredentials", in notes
function validateCredentials(name, password) {
  if ('string' !== typeof name) throw new TypeError()
  if ('string' !== typeof password) throw new TypeError()

  if (name && password) return null

  const errors = {
    node: {
      name: { errors: [] },
      password: { errors: [] },
    },
  }

  if (!name) errors.node.name.errors.push(m.EmptyError.create('name must be non-empty'))
  if (!password) errors.node.password.errors.push(m.EmptyError.create('password must be non-empty'))

  console.log('validateCredentials, errors:', errors)
  if (!name || !password) throw errors
}

export { validateCredentials }
