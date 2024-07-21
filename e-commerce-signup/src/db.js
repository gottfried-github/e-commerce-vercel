import generateHash from './helpers.js'

async function createAdmin(username, email, password, {c}) {
    if (password.normalize() !== password) throw new Error("normalized version of password differs from original") 
    
    const data = {name: username, email: email, ...generateHash(password)}

    let res = null

    try {
        res = await c.insertOne(data)
    } catch(e) {
        throw e
    }

    return res
}

export default createAdmin