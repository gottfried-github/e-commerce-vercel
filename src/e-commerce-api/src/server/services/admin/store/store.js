import auth from './store-auth.js'

function main(store) {
  return {
    auth: auth(store.auth),
  }
}

export default main
