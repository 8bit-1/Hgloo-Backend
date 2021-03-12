const db = require('./db');

async function getCountry(){
    const result = await db.query(`SELECT pais FROM pais`);
    if (!result) { return [];}
    return result;
}

async function getProvinceById(id){
    const result = await db.queryP(
        `SELECT departamento FROM departamento where idPais=?`,[id]);

    if (!result) { return [];}
    return result;
}

async function getCityById(id){
    const result = await db.queryP(
        `SELECT nombreciudad FROM ciudad where idDepartamento=?`,[id]);

    if (!result) { return [];}
    return result;
}


module.exports = {
    getCountry,
    getProvinceById,
    getCityById
}