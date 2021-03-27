const db = require('./db');

async function getCoin(){
    const result = await db.query(`SELECT Moneda FROM moneda`);
    if (!result) { return [];}
    return result;
}

module.exports = {
    getCoin
}