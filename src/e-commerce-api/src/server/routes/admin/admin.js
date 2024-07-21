import { Router } from 'express'
import passport from 'passport'

import { auth } from './auth.js'
import product from './product.js'
import user from './user.js'

function admin(services, middleware, options) {
  const router = Router()

  /* setup passport */
  router.use(passport.initialize())
  router.use(passport.session())

  /* setup routes */
  router.use('/auth', auth(null, middleware.auth).router)

  // restrict access to other routes unless logged in
  router.use((req, res, next) => {
    req.log('/api/admin, req.user:', req.user)
    if (!req.user) {
      // see "HTTP authentication, passportjs", in notes
      res.set({ 'WWW-Authenticate': 'Basic' })
      return res.status(401).json({ message: 'the request is not authenticated' })
    }

    next()
  })

  router.use('/product', product(services.resources.product, middleware.product).router)
  router.use('/user', user().router)

  /* central error handling */
  router.use(middleware.errorHandler)

  return router
}

export default admin
