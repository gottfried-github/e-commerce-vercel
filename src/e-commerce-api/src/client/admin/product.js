/**
 * @param {Object} _body
 */
async function create(_body, successCb, failureCb) {
  const res = await fetch('/api/admin/product/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(_body),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

/**
 * @param {String} id bson ObjectId-formatted id
 * @param {Object} write fields to write
 * @param {Array} remove fields to remove (`String`s)
 */
async function update(id, write, remove, successCb, failureCb) {
  const _body = {}
  if (write) _body.write = write
  if (remove) _body.remove = remove

  const res = await fetch(`/api/admin/product/update/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(_body),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function _delete(id, successCb, failureCb) {
  const res = await fetch(`/api/admin/product/delete/${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

/**
 * @param {String} id bson ObjectId-formatted id
 * @param {Array} files File instances
 * @description wraps the data in FormData and sends to api
 */
async function upload(id, files, successCb, failureCb) {
  const form = new FormData()

  form.append('id', id)

  for (const file of files) {
    form.append('files', file)
  }

  const res = await fetch('/api/admin/product/photos/upload', {
    method: 'POST',
    body: form,
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function removePhotos(productId, photosIds, successCb, failureCb) {
  const res = await fetch('/api/admin/product/photos/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      photosIds,
    }),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function reorderPhotos(productId, photos, successCb, failureCb) {
  const res = await fetch('/api/admin/product/photos/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      photos,
    }),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function updatePhotosPublicity(productId, photos, successCb, failureCb) {
  const res = await fetch('/api/admin/product/photos/updatePublicity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      photos,
    }),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function setCoverPhoto(productId, photo, successCb, failureCb) {
  const res = await fetch('/api/admin/product/photos/setCover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productId,
      photo,
    }),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function getPhotos(productId, publicPhotos, successCb, failureCb) {
  const _body = { productId }
  if (typeof publicPhotos === 'boolean') _body.public = publicPhotos

  const res = await fetch('/api/admin/product/photos/get', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(_body),
  })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

/**
 * @param {String} id id of product to get
 */
async function get(id, successCb, failureCb) {
  const res = await fetch(`/api/admin/product/${id}`, { method: 'GET' })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

async function getMany(successCb, failureCb) {
  const res = await fetch(`/api/admin/product/get-many`, { method: 'GET' })

  const body = await res.json()

  if (!res.ok) return failureCb(body, res)
  return successCb(body, res)
}

export {
  create,
  update,
  _delete as delete,
  upload,
  removePhotos,
  get,
  getMany,
  reorderPhotos,
  updatePhotosPublicity,
  setCoverPhoto,
  getPhotos,
}
