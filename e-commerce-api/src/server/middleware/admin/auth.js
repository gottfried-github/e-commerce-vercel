import { log, logger } from '../../logger.js'
import * as m from '../../../../../e-commerce-common/messages.js'

import passport from 'passport'
import { setup } from './auth-setup.js'

import { validateCredentials } from './auth-helpers.js'

// import {create, getByName, getById, isCorrectPassword} from 'bazar-user-mongo'

function auth(services) {
  setup(services)

  function authenticate(req, res, next) {
    return new Promise(async (resolve, reject) => {
      try {
        validateCredentials(req.body.name, req.body.password)
      } catch (e) {
        return reject(e)
      }

      passport.authenticate('local', (e, user, _res) => {
        if (e) return reject(e)

        // user not found (see point 1. and point 7. in `what happens during requests` in `passportjs` reference)
        if (!user) return resolve(_res)

        req.log('/login, passport.authenticate cb - user is truthy')

        // when manually calling passport.authenticate, instead of passing it as middleware, `req.login` should be called manually:
        // https://stackoverflow.com/a/67084675
        req.login(user, e => {
          if (e) return reject(e)

          resolve(true)
        })
      })(req, res, next)
    })
  }

  // async function signup(req, res, next) {
  //     return new Promise(async (resolve, reject) => {
  //         try {
  //             validateCredentials(req.body.name, req.body.password)
  //         } catch (e) {
  //             return reject(e)
  //         }

  //         try {
  //             await store.create({name: req.body.name, password: req.body.password})
  //         } catch(e) {
  //             req.log('/signup, createUser throws:', e)
  //             return reject(e)
  //         }

  //         return resolve(true)
  //     })
  // }

  return authenticate
}

export default auth
