import bodyParser from 'body-parser'
import { Router } from 'express'

import * as m from '../../../../../e-commerce-common/messages.js'

import files from './product-files.js'

function product(services, middleware) {
  const router = Router()

  router.post(
    '/create',
    bodyParser.json(),
    middleware.validate.product.create,
    // handle request
    async (req, res, next) => {
      // console.log('/api/admin/product/create, body.fields:', req.body.fields)

      let id = null
      try {
        id = await services.create(req.body)
      } catch (e) {
        return next(e)
      }

      res.status(201).json(id)
    }
  )

  // see '/api/admin/product:id' in notes for why I don't validate params.id
  router.post(
    '/update/:id',
    bodyParser.json(),
    middleware.validate.product.update,
    // handle request
    async (req, res, next) => {
      let _res = null

      try {
        _res = await services.update(req.params.id, req.body)
      } catch (e) {
        return next(e)
      }

      res.status(200).json(_res)
    }
  )

  router.post('/delete/:id', async (req, res, next) => {
    try {
      const _res = await services.delete(req.params.id)

      res.status(200).json(_res)
    } catch (e) {
      return next(e)
    }
  })

  router.get('/get-many', async (req, res, next) => {
    let products = null

    try {
      products = await services.getMany()
    } catch (e) {
      return next(e)
    }

    res.json(products)
  })

  // see '/api/admin/product:id' in notes for why I don't validate params.id
  router.get('/:id', async (req, res, next) => {
    // console.log('/api/admin/product/, req.query:', req.query);
    let _product = null
    try {
      _product = await services.getById(req.params.id)
    } catch (e) {
      return next(e)
    }

    if (null === _product) return res.status(404).json({ message: 'document not found' })
    res.json(_product)
  })

  router.use(
    '/photos',
    files(services, {
      files: middleware.files,
      validate: middleware.validate.photos,
    }).router
  )

  return { router }
}

export default product
