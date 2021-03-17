const db = require('./db');

async function getCategory(){
    const result = await db.query(`SELECT nombrecategoria FROM categoria`);
    if (!result) { return [];}
    return result;
}

module.exports = {
    getCategory
}