const db = require('./db');

async function getReportProduct(){
    const result = await db.query(`SELECT idReporte,reporte FROM reporte`);
    if (!result) { return [];}
    return result;
}


async function getReportUser(){
    const result = await db.query(`SELECT idReporteUsuario,reporteUsuario FROM reporteUsuario`);
    if (!result) { return [];}
    return result;
}

async function getReportComment(){
    const result = await db.query(`SELECT idReporteComentario,reporteComentario FROM reporteComentario`);
    if (!result) { return [];}
    return result;
}




module.exports={
    getReportProduct,
    getReportUser,
    getReportComment
}