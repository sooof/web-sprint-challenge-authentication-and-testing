const db = require('../../data/dbConfig')

function find() {
    return db('users')
}

function findById(id) {
    return db('users').where('id', id).first()
}


function findBy(user) {
    return db('users').where(user).first()
}


async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}

module.exports = {
    find,
    findById,
    findBy,
    add,
}
