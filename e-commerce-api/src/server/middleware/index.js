import admin from './admin/admin.js'
import visitor from './visitor/visitor.js'
import errorHandler from './error-handler.js'

function main(services, options) {
  return {
    admin: admin(
      {
        store: services.store.admin,
        resources: services.resources.admin,
      },
      options
    ),
    visitor: visitor(),
    common: { errorHandler: errorHandler() },
  }
}

export default main
