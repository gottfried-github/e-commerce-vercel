import fs from 'fs/promises'
import path from 'path'

/**
 * @param {String} options.productUploadPath path to uploads dir, relative to options.root
 * @param {String} options.productDiffPath path, relative to which actual pathname of each uploaded file should be stored
 * @param {String} options.root absolute path to app's root
 * @param {String} options.productPublicPrefix should be prepended to file's public path
 */
function main(store, options) {
  return {
    create(fields) {
      return store.product.create(fields)
    },

    async update(id, fields) {
      const res = await store.product.update(id, {
        write: fields.write || null,
        remove: fields.remove || null,
      })
      return store.product.getById(id)
    },

    async delete(id) {
      const resProduct = await store.product.delete(id)

      await fs.rm(path.join(options.root, options.productUploadPath, id), {
        recursive: true,
        force: true,
      })

      return resProduct
    },

    getMany() {
      // see Products view in product spec
      return store.product.getMany(null, null, [{ name: 'time', dir: -1 }])
    },

    getById(id) {
      return store.product.getById(id)
    },

    async addPhotos(id, photos) {
      let res = null

      try {
        res = await store.product.addPhotos(id, photos)
      } catch (eDb) {
        // remove photos files from the filesystem
        try {
          for (const photo of photos) {
            for (const k of Object.keys(photo.pathsLocal)) {
              await fs.rm(path.join(options.root, photo.pathsLocal[k]))
            }
          }
        } catch (eFiles) {
          const _e = new Error('adding photos to the database and removing respective files failed')

          _e.errorDb = eDb
          _e.errorFiles = eFiles

          throw _e
        }

        throw eDb
      }

      if (res !== true) throw new Error('store returned incorrect value')

      // get the product to send to the client
      return res
    },

    async removePhotos(productId, photosIds) {
      const photosDocs = await store.product.getPhotos(productId)

      const photosToRemoveDocs = photosDocs.reduce((photosToRemove, photo) => {
        if (photosIds.includes(photo.id.toString())) photosToRemove.push(photo)

        return photosToRemove
      }, [])

      let res = null

      try {
        res = await store.product.removePhotos(productId, photosIds)
      } catch (e) {
        throw e
      }

      if (res !== true) throw new Error('store returned incorrect value')

      // remove photos from filesystem
      try {
        for (const photo of photosToRemoveDocs) {
          for (const k of Object.keys(photo.pathsLocal)) {
            await fs.rm(path.join(options.root, photo.pathsLocal[k]))
          }
        }
      } catch (e) {
        throw e
      }

      return true
    },

    async reorderPhotos(productId, photos) {
      let res = null

      try {
        res = await store.product.reorderPhotos(productId, photos)
      } catch (e) {
        throw e
      }

      if (res !== true) throw new Error('store returned incorrect value')

      return res
    },

    async updatePhotosPublicity(productId, photos) {
      let res = null

      try {
        res = await store.product.updatePhotosPublicity(productId, photos)
      } catch (e) {
        throw e
      }

      if (res !== true) throw new Error('store returned incorrect value')

      return res
    },

    async getPhotos(productId, publicPhotos) {
      return store.product.getPhotos(
        productId,
        typeof publicPhotos === 'boolean' ? publicPhotos : null
      )
    },

    async setCoverPhoto(productId, photo) {
      let res = null

      try {
        res = await store.product.setCoverPhoto(productId, photo)
      } catch (e) {
        throw e
      }

      if (res !== true) throw new Error('store returned incorrect value')

      return res
    },
  }
}

export default main
