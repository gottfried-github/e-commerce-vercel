import { list } from '@vercel/blob'

function main(options) {
  return {
    async getFilesData() {
      let files = []

      let hasMore = true
      let cursor = null

      while (hasMore) {
        const {
          blobs,
          hasMore: _hasMore,
          cursor: _cursor,
        } = await list({ prefix: options.productUploadPath, cursor })

        files = [...files, ...blobs]

        hasMore = _hasMore
        cursor = _cursor
      }

      return files
    },
  }
}

export default main
