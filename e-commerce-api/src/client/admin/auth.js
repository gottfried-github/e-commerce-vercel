// async function signup(name, password, successCb, failureCb) {
//     const _body = new URLSearchParams()
//     _body.append('name', name)
//     _body.append('password', password)

//     const req = new Request('/api/admin/auth/signup', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         body: _body.toString()
//     })

//     const res = await fetch(req)
//     const body = await res.json()

//     if (!res.ok && failureCb) return failureCb(body, res)
//     return successCb(body, res, name, password)
// }

async function login(name, password, successCb, failureCb) {
  const _body = new URLSearchParams()
  _body.append('name', name)
  _body.append('password', password)

  const req = new Request('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: _body.toString(),
  })

  const res = await fetch(req)
  const body = await res.json()
  if (!res.ok && failureCb) return failureCb(body, res)
  return successCb(body, res)
}

async function isAuthenticated(successCb, failureCb) {
  const res = await fetch('/api/admin/auth/is-authenticated', { method: 'GET' })

  const body = await res.json()

  if (!res.ok && failureCb) return failureCb(body, res)
  return successCb(body, res)
}

export { login, isAuthenticated }
