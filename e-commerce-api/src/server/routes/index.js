import { Router } from 'express'

import { log, logger } from '../logger.js'

import admin from './admin/admin.js'
import visitor from './visitor/visitor.js'

function main(services, middleware, options) {
  const router = Router()

  /* attach logger to express */
  router.use((req, res, next) => {
    req.log = log.bind(logger)
    next()
  })

  console.log('routes, index - middleware:', middleware)

  router.use(
    '/admin',
    admin(
      {
        resources: services.resources.admin,
      },
      { ...middleware.admin, ...middleware.common },
      options
    )
  )
  router.use(
    visitor(
      {
        store: services.store.visitor,
      },
      { ...middleware.visitor, ...middleware.common }
    )
  )

  return router
}

export default main
