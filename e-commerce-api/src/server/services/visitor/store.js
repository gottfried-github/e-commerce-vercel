import product from './store-product.js'

function main(store) {
  return { product: product(store) }
}

export default main
