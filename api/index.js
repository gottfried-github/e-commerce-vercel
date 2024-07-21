import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import SessionStorage from 'connect-mongo'
import express from 'express'
import { MongoClient } from 'mongodb'

import { imageScaleTemplates } from '../src/config.js'
import { api as _api } from '../src/e-commerce-api/src/server/index.js'
import _store from '../src/e-commerce-mongo/src/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function main(port) {
  /* ensure environment variables */
  // express-session uses this
  if (!process.env.SESSION_SECRETS)
    throw new Error('SESSION_SECRETS environment variable must be set')

  /* express-session setup (see `express-session` in e-commerce-api) */
  const sessionOptions = {
    secret: process.env.SESSION_SECRETS.split(' '),
    saveUninitialized: false,
    resave: false,
    store: SessionStorage.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      touchAfter: 24 * 3600,
    }),
    cookie: {
      httpOnly: true,
      sameSite: false,
      secure: false,
    },
  }

  // if (process.env.NODE_ENV === 'production') sessionOptions.cookie.secure = true

  /* connect to database */
  const client = new MongoClient(process.env.MONGODB_URI)
  client.connect()

  /* initialize store and api */
  const store = _store(client.db(process.env.DB_NAME), client)
  const api = _api(store, {
    productUploadPath: 'public/product',
    productDiffPath: 'public',
    root: __dirname,
    productPublicPrefix: '/',
    imageScaleTemplates,
  })

  /* express application setup */
  const app = express()

  app.use(session(sessionOptions))

  app.use('/api/', api)

  // send index.html from anywhere: let front-end handle routing
  app.use(['/admin', '/admin/*'], (req, res, next) => {
    res.sendFile(path.join(__dirname, '../dist/front-end/admin.html'))
  })

  app.use('/', express.static(path.join(__dirname, '../dist/front-end')))
  app.use('/', express.static(path.join(__dirname, '../public')))

  app.use('/*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../dist/front-end/visitor.html'))
  })

  /* start server */
  const server = app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })

  return { app, server, api, store }
}

const portStr = process.env.HTTP_PORT || '3000'

main(parseInt(portStr, 10))
console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
