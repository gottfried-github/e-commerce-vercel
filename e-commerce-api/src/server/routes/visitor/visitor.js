import { Router } from 'express'

import product from './product.js'

function visitor(services, middleware) {
  const router = Router()

  router.use('/product', product(services.store.product, middleware.product).router)
  router.use(middleware.errorHandler)

  return router
}

export default visitor
