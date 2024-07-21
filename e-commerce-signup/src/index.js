import { MongoClient } from 'mongodb'
import createAdmin from './db.js'

async function main(username, email, password) {
  /* connect to database */
  const client = new MongoClient(process.env.MONGODB_URI)
  client.connect()

  await createAdmin(username, email, password, {
    c: client.db(process.env.DB_NAME).collection('admins'),
  })

  console.log('created admin user successfully')
  process.exit()
}

export default main
