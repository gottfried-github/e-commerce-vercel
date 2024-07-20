import middleware from './middleware/index.js'
import services from './services/index.js'
import routes from './routes/index.js'

function api(store, options) {
  const _services = services(store, options)
  const _middleware = middleware(_services, options)

  const router = routes(_services, _middleware)

  return router
}

export { api }
