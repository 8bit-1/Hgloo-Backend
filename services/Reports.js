const db = require('./db');

async function getReport(){
    const result = await db.query(`SELECT reporte FROM reporte`);
    if (!result) { return [];}
    return result;
}


module.exports={
    getReport
}