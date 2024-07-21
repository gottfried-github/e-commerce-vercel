async function logout(successCb, failureCb) {
  const res = await fetch('/api/admin/user/logout', { method: 'GET' })
  const body = await res.json()

  if (!res.ok && failureCb) return failureCb(body, res)
  return successCb(body, res)
}

export { logout }
