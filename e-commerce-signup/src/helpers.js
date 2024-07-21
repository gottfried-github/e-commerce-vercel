import crypto from 'crypto'

function generateHash(password) {
    const salt = crypto.randomBytes(16)
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512')

    return {salt, hash}
}

export default generateHash