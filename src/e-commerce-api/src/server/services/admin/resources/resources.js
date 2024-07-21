import product from './product.js'

function main(store, options) {
  return {
    product: product(
      {
        product: store.product,
      },
      options
    ),
  }
}

export default main
