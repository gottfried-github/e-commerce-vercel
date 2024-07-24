import { Router } from 'express'

function main(services) {
  const router = Router()

  router.get('/', async (req, res) => {
    res.json({ data: await services.getFilesData() })
  })

  return { router }
}

export default main
