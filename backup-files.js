import { Buffer } from 'buffer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const login = async () => {
  const body = new URLSearchParams()
  body.append('name', process.env.APP_ADMIN_USERNAME)
  body.append('password', process.env.APP_ADMIN_PSSWD)

  const res = await fetch(`${process.env.APP_URL}/api/admin/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  return res.headers.getSetCookie()[0]
}

const downloadFile = async (fileData, { uploadsDirPrefix }) => {
  const fileRes = await fetch(fileData.downloadUrl)

  const fileBody = await fileRes.arrayBuffer()
  const fileBuffer = Buffer.from(fileBody)

  const fileDir = path.join(uploadsDirPrefix, path.dirname(fileData.pathname))

  await fs.mkdir(fileDir, {
    recursive: true,
  })

  await fs.writeFile(path.join(fileDir, path.basename(fileData.pathname)), fileBuffer)
}

const main = async () => {
  const authCookie = await login()

  const filesDataRes = await fetch(`${process.env.APP_URL}/api/admin/files`, {
    headers: {
      Cookie: authCookie,
    },
  })

  const filesDataBody = await filesDataRes.json()

  const uploadsDirPrefix = path.join(
    __dirname,
    'backup/uploads',
    `e-commerce-vercel_${new Date().toISOString()}`
  )

  for (const file of filesDataBody.data) {
    await downloadFile(file, { uploadsDirPrefix })
  }
}

main()
