import passport from 'passport'
import LocalStrategy from 'passport-local'
import { logger, log } from '../../logger.js'
import * as m from '../../../../../e-commerce-common/messages.js'

function setup(store) {
  async function local(name, password, cb) {
    log(`passport LocalStrategy cb - name, password are here`)
    let user = null
    try {
      // this throws if password is incorrect
      user = await store.getByName(name, password)
    } catch (e) {
      if (m.InvalidCriterion.code === e.code)
        return cb(m.InvalidCriterion.create('password is incorrect'))

      // this should call the callback to passport.authenticate with the error (as in 1. of `what happens during requests`)
      return cb(e)
    }

    // Login/response/user doesn't exist, in docs
    if (!user) return cb(null, false, m.ResourceNotFound.create("user doesn't exist"))

    log(`passport LocalStrategy cb - user is truthy`)

    return cb(null, user)
  }

  passport.use(
    new LocalStrategy(
      /*3 in 'Function'/'inward':*/ { usernameField: 'name', passwordField: 'password' },
      local
    )
  )
  passport.serializeUser((user, done) => {
    console.log('passport serializeUser cb, user', user)

    // see point 3. in `what happens during requests` in `passportjs` reference
    if (!user) return done(new Error('user serialization failed, user is falsy'))

    // if `user._id` is falsy, then `req.login` callback will be passed an error (see point 4. in `what happens during requests` in `passportjs` reference)
    done(null, user.id)
  })

  passport.deserializeUser(async (id, done) => {
    console.log('passport deserializeUser cb, id', id)

    let user = null
    try {
      user = await store.getById(id)
    } catch (e) {
      e.message = `passport user deserialization failed, e.message: ${e.message}`

      // see point 5. in `what happens during requests` in `passportjs` reference
      return done(e)
    }

    // see point 6. in `what happens during requests` in `passportjs` reference
    if (!user) return done(null, false)

    console.log('passport deserializeUser cb, user is truthy')

    done(null, user)
  })
}

export { setup }
