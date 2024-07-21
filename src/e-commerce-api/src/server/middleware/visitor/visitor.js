import validate from './product-validate.js'

function main() {
  return {
    product: { validateGetMany: validate() },
  }
}

export default main
