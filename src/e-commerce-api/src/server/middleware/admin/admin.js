import auth from './auth.js'
import authValidate from './auth-validate.js'
import validateProduct from './product/product-validate.js'
import validatePhotosGet from './product/photos-get-validate.js'
import validatePhotosRemove from './product/photos-remove-validate.js'
import validatePhotosReorder from './product/photos-reorder-validate.js'
import validatePhotosUpdatePublicity from './product/photos-updatePublicity-validate.js'
import validatePhotosSetCover from './product/photos-setCover-validate.js'
import files from './product/photos-files.js'

function main(services, options) {
  return {
    auth: {
      auth: auth(services.store.auth),
      validate: authValidate(),
    },
    product: {
      validate: {
        product: validateProduct(),
        photos: {
          get: validatePhotosGet(),
          remove: validatePhotosRemove(),
          reorder: validatePhotosReorder(),
          updatePublicity: validatePhotosUpdatePublicity(),
          setCover: validatePhotosSetCover(),
        },
      },
      files: files(options),
    },
  }
}

export default main
