const db = require('./db');

async function getCountry(){
    const result = await db.query(`SELECT idPais, pais FROM pais`);
    if (!result) { return [];}
    return result;
}

async function getProvinceById(id){
    const result = await db.queryP(
        `SELECT departamento FROM idDepartamento, departamento where idPais=?`,[id]);

    if (!result) { return [];}
    return result;
}

async function getCityById(id){
    const result = await db.queryP(
        `SELECT idCiudad, nombreciudad FROM ciudad where idDepartamento=?`,[id]);

    if (!result) { return [];}
    return result;
}


module.exports = {
    getCountry,
    getProvinceById,
    getCityById
}