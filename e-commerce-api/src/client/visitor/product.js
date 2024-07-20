/**
 * @param {String} id id of product to get
 */
async function get(id, successCb, failureCb) {
  const res = await fetch(`/api/product/${id}`, { method: 'GET' })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

/**
 * @param {Object} _body
 */
async function getMany(name, dir, inStock, successCb, failureCb) {
  const res = await fetch('/api/product/get-many', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      dir,
      inStock,
    }),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

export { get, getMany }
