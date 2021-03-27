const db = require('./db');

async function getGenre(){
    const result = await db.query(`SELECT idGenero, Genero FROM genero`);
    if (!result) { return [];}
    return result;
}

module.exports = {
    getGenre
}