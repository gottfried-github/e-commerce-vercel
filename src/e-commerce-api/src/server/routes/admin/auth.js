import bodyParser from 'body-parser'
import { Router } from 'express'

import { log, logger } from '../../logger.js'
import * as m from '../../../../../e-commerce-common/messages.js'

function authenticate(req, res, next, { authenticate }) {
  return authenticate(req, res, next)
    .then(_res => {
      // req.log('authMiddleware, authenticate resolved, _res:', _res)

      if (true !== _res) {
        if (m.ResourceNotFound.code === _res.code) {
          return res.status(404).json(_res)
        } else {
          return next(_res)
        }
      }

      return res.json({ message: 'successfully logged in' })
    })
    .catch(e => {
      // req.log('authMiddleware, authenticate rejected, e:', e)
      next(e)
    })
}

// function signup(req, res, next, {signup}) {
//     return signup(req, res, next).then(_res => {
//         req.log('signupMiddleware, signup resolved, _res:', _res)

//         if (true !== _res) return next(_res)

//         return res.status(201).json({})
//     }).catch(e => {
//         req.log('signupMiddleware, signup rejected, e:', e)

//         next(e)
//     })
// }

function auth(services, middleware) {
  const router = Router()

  router.post(
    '/login',
    bodyParser.urlencoded({ extended: false }),
    middleware.validate,
    (req, res, next) => {
      authenticate(req, res, next, { authenticate: middleware.auth })
    }
  )
  // router.post('/signup', bodyParser.urlencoded(), ensureCredentials,
  //     // validate password
  //     (req, res, next) => {
  //         const errors = validatePsswd(req.body.password)
  //         if (errors) return next(errors)

  //         next()
  //     },
  //     (req, res, next) => {signup(req, res, next, {signup: auth.signup})}
  // )

  router.get('/is-authenticated', (req, res) => {
    console.log('/api/admin/auth/is-authenticated, req.user:', req.user)
    res.json(!!req.user)
  })

  return { router }
}

export { auth, authenticate }
