import path from 'path'
import fs from 'fs/promises'
import createError from 'http-errors'
import multer from 'multer'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

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

/**
 * @param {String} options.productUploadPath path to uploads dir, relative to options.root
 * @param {String} options.productDiffPath path, relative to which actual pathname of each uploaded file should be stored
 * @param {String} options.root absolute path to app's root
 * @param {String} options.productPublicPrefix should be prepended to file's public path
 */
function main(options) {
  const multerMiddleware = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        if (!req.body?.id)
          return cb(createError(400, "'id' field must precede 'files' in the formdata"))
        const dirPath = path.join(options.root, path.join(options.productUploadPath, req.body.id))

        await fs.mkdir(dirPath, { recursive: true })

        cb(null, dirPath)
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now().toString()}${path.extname(file.originalname)}`)
      },
    }),
  }).array('files', 200)

  const imageResizeMiddleware = async (req, res, next) => {
    for (const file of req.files) {
      const scaledPaths = {}
      const filePathComponents = path.parse(file.path)

      for (const template of options.imageScaleTemplates) {
        const filePathname = `${path.join(filePathComponents.dir, filePathComponents.name)}_${template.suffix}${filePathComponents.ext}`

        await sharp(file.path)
          .resize(template.width, template.height, template.options)
          .toFile(filePathname)

        scaledPaths[template.suffix] = filePathname
      }

      file.scaledPaths = scaledPaths
    }

    next()
  }

  const pathsTransformMiddleware = (req, res, next) => {
    req.filesPaths = req.files.map(file => {
      const paths = Object.keys(file.scaledPaths).reduce(
        (paths, k) => {
          paths.pathsPublic[k] = makePublicPath(options, file.scaledPaths[k])
          paths.pathsLocal[k] = makeLocalPath(options, file.scaledPaths[k])

          return paths
        },
        {
          pathsPublic: { original: makePublicPath(options, file.path) },
          pathsLocal: { original: makeLocalPath(options, file.path) },
        }
      )

      return paths
    })

    next()
  }

  return [multerMiddleware, imageResizeMiddleware, pathsTransformMiddleware]
}

export default main
