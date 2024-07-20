function main(store) {
  return {
    getById(id) {
      return store.getById(id)
    },

    getByName(name, password) {
      return store.getByName(name, password)
    },
  }
}

export default main
