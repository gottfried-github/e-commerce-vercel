import storeAdmin from './admin/store/store.js'
import resourcesAdmin from './admin/resources/resources.js'
import filesAdmin from './admin/files.js'
import storeVisitor from './visitor/store.js'

function main(store, options) {
  return {
    store: {
      admin: storeAdmin(store),
      visitor: storeVisitor(store),
    },
    resources: {
      admin: resourcesAdmin(store, options),
    },
    other: {
      admin: {
        files: filesAdmin(options),
      },
    },
  }
}

export default main
