import storeAdmin from './admin/store/store.js'
import resourcesAdmin from './admin/resources/resources.js'
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
  }
}

export default main
