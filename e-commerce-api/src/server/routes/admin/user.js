import bodyParser from 'body-parser'
import { Router } from 'express'

function main() {
  const router = Router()

  router.get('/logout', (req, res, next) => {
    req.logout(null, () => {})
    req.log('logged out')
    res.json({ message: 'successfully logged out' })
  })

  return { router }
}

export default main
