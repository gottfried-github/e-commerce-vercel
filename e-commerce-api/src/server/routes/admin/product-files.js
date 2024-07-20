import express from 'express'
import bodyParser from 'body-parser'

import * as m from '../../../../../e-commerce-common/messages.js'

function main(services, middleware) {
  const router = express.Router()

  router.post('/upload', middleware.files, async (req, res, next) => {
    let _res = null

    try {
      _res = await services.addPhotos(req.body.id, req.filesPaths)
    } catch (e) {
      return next(e)
    }

    res.status(201).json(_res)
  })

  router.post('/get', bodyParser.json(), middleware.validate.get, async (req, res, next) => {
    let _res = null

    try {
      _res = await services.getPhotos(
        req.body.productId,
        typeof req.body.public === 'boolean' ? req.body.public : null
      )
    } catch (e) {
      return next(e)
    }

    res.status(200).json(_res)
  })

  router.post('/remove', bodyParser.json(), middleware.validate.remove, async (req, res, next) => {
    let _res = null

    try {
      _res = await services.removePhotos(req.body.productId, req.body.photosIds)
    } catch (e) {
      return next(e)
    }

    res.status(201).json(_res)
  })

  router.post(
    '/reorder',
    bodyParser.json(),
    middleware.validate.reorder,
    async (req, res, next) => {
      let _res = null

      try {
        _res = await services.reorderPhotos(req.body.productId, req.body.photos)
      } catch (e) {
        return next(e)
      }

      res.status(201).json(_res)
    }
  )

  router.post(
    '/updatePublicity',
    bodyParser.json(),
    middleware.validate.updatePublicity,
    async (req, res, next) => {
      let _res = null

      try {
        _res = await services.updatePhotosPublicity(req.body.productId, req.body.photos)
      } catch (e) {
        return next(e)
      }

      res.status(201).json(_res)
    }
  )

  router.post(
    '/setCover',
    bodyParser.json(),
    middleware.validate.setCover,
    async (req, res, next) => {
      let _res = null

      try {
        _res = await services.setCoverPhoto(req.body.productId, req.body.photo)
      } catch (e) {
        return next(e)
      }

      res.status(201).json(_res)
    }
  )

  return { router }
}

export default main
