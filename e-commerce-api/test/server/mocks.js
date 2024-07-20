class Req {
  log() {}
}

class Res {
  constructor(statusCb, jsonCb) {
    this._statusCb = statusCb || null
    this._jsonCb = jsonCb || null
  }

  status(...args) {
    if (this._statusCb) this._statusCb(...args)

    return this
  }

  json(...args) {
    if (this._jsonCb) this._jsonCb(...args)
  }
}

export { Req, Res }
