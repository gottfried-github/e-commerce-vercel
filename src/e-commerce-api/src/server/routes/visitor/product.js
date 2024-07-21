import bodyParser from 'body-parser'
import { Router } from 'express'

import * as m from '../../../../../e-commerce-common/messages.js'

function product(services, middleware) {
  const router = Router()

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

  router.post(
    '/get-many',
    bodyParser.json(),
    middleware.validateGetMany,
    async (req, res, next) => {
      let products = null

      try {
        products = await services.getMany(req.body.inStock, req.body.dir, req.body.name)
      } catch (e) {
        return next(e)
      }

      res.json(products)
    }
  )

  return { router }
}

export default product
