const db = require('./db');

async function getCondition(){
    const result = await db.query(`SELECT idCondicion,condicion FROM condicion`);
    if (!result) { return [];}
    return result;
}

module.exports = {
    getCondition
}