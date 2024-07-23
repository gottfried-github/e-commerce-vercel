import path from 'path'
import fs from 'fs/promises'
import createError from 'http-errors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { put } from '@vercel/blob'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const makePublicPath = (options, filePath) => {
  return path.join(
    options.productPublicPrefix,
    path.relative(path.join(options.root, options.productDiffPath), filePath)
  )
}

const makeLocalPath = (options, filePath) => {
  return path.relative(options.root, filePath)
}

const makeFilePathname = (options, productId, filenameNew, filename, suffix) => {
  return path.join(
    options.productUploadPath,
    productId,
    `${filenameNew}${suffix ? `_${suffix}` : ''}${path.extname(filename)}`
  )
}

/**
 * @param {String} options.productUploadPath path to uploads dir, relative to options.root
 * @param {String} options.productDiffPath path, relative to which actual pathname of each uploaded file should be stored
 * @param {String} options.root absolute path to app's root
 * @param {String} options.productPublicPrefix should be prepended to file's public path
 */
function main(options) {
  const multerMiddleware = multer().array('files', 200)

  const imageUploadMiddleware = async (req, res, next) => {
    for (const file of req.files) {
      const filenameNew = Date.now().toString()
      const filePathname = makeFilePathname(options, req.body.id, filenameNew, file.originalname)

      const fileData = await put(filePathname, file.buffer, {
        access: 'public',
        addRandomSuffix: false,
      })

      file.path = fileData.url

      const scaledPaths = {}

      for (const template of options.imageScaleTemplates) {
        const fileBuffer = await sharp(file.buffer)
          .resize(template.width, template.height, template.options)
          .toBuffer()

        const filePathname = makeFilePathname(
          options,
          req.body.id,
          filenameNew,
          file.originalname,
          template.suffix
        )

        const fileData = await put(filePathname, fileBuffer, {
          access: 'public',
          addRandomSuffix: false,
        })

        scaledPaths[template.suffix] = fileData.url
      }

      file.scaledPaths = scaledPaths
    }

    next()
  }

  const pathsTransformMiddleware = (req, res, next) => {
    req.filesPaths = req.files.map(file => {
      const paths = Object.keys(file.scaledPaths).reduce(
        (paths, k) => {
          paths.pathsPublic[k] = file.scaledPaths[k]
          paths.pathsLocal[k] = file.scaledPaths[k]

          return paths
        },
        {
          pathsPublic: { original: file.path },
          pathsLocal: { original: file.path },
        }
      )

      return paths
    })

    next()
  }

  return [multerMiddleware, imageUploadMiddleware, pathsTransformMiddleware]
}

export default main
