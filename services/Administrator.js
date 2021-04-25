const db = require('./db');


async function unsubscribeUser(idUser){
    const result = await db.queryP(
        `UPDATE usuario SET idEstado=2 where idUsuario=?;`,[idUser]);
    if (!result) { return [];
    
    }

    let message = 'Error unsubscribe User';

    if (result.affectedRows) {
        message = 'User unsuscribe sucessfully';
    }

    return message;

}

async function unsubscribeProduct(idProduct){
    const result = await db.queryP(
        `UPDATE producto SET idEstadoProducto=2 where idProducto=?;`,[idProduct]);

    if (!result) { return [];
    
    }

    let message = 'Error unsubscribe product';

    if (result.affectedRows) {
        message = 'product unsuscribe sucessfully';
    }

    return message;

}


async function unsubscribeUser2(idAdmin,idUser){
    const result = await db.queryP(
        `UPDATE usuario SET idEstado=2 where idUsuario=?;`,[idUser]);
    if (!result) { return [];
    
    }

    let message = 'Error unsubscribe User';

    if (result.affectedRows) {
        message = 'User unsuscribe sucessfully';
    }

    return message;

}

async function unsubscribeProduct2(idAdmin,idProduct){
    const result = await db.queryP(
        `UPDATE producto SET idEstadoProducto=2 where idProducto=?;`,[idProduct]);

    if (!result) { return [];
    
    }

    let message = 'Error unsubscribe product';

    if (result.affectedRows) {
        message = 'product unsuscribe sucessfully';
    }

    return message;

}

async function userByDate(){
    let años=[]
    años= await db.queryP(`SELECT DISTINCT(YEAR(fechaRegistro)) as year FROM usuario`)
    let result=[];
    let data=[];

    for(var j=0;j<años.length;j++){
        años[j]["data"]=await db.queryP(`SELECT MONTHNAME(fechaRegistro)as month,COUNT(idUsuario) as users FROM usuario 
                                     where YEAR(fechaRegistro)=? GROUP BY MONTH(fechaRegistro)`,[años[j].year])    
    }

    return años;
}   

async function userByYear(){
    let años=[]
    años= await db.queryP(`SELECT YEAR(fechaRegistro) as year, COUNT(idUsuario)as users FROM usuario group by(YEAR(fechaRegistro))`)
    return años;
}   

async function getTopUsers(){
    const result = await db.query(`SELECT u.idUsuario as idUser, CONCAT(u.nombreUsuario," ", u.apellidoUsuario) as name, CAST(AVG(c.calificacion) AS DECIMAL(10,0)) as qualification  FROM usuario u
    INNER JOIN calificacion c ON u.idUsuario=c.Calificado 
    GROUP BY c.Calificado 
    ORDER BY calificacion DESC  LIMIT 10`);
    if (!result) { return [];}
    return result;
}

async function getTopCategory(){
    const result = await db.query(`SELECT c.nombreCategoria as name, COUNT(cu.idCategoria)as value FROM categoriausuario cu
    INNER JOIN categoria c 
    ON cu.idCategoria= c.idCategoria
    GROUP BY cu.idCategoria
    ORDER BY value DESC`);
    if (!result) { return [];}
    return result;
}

async function getTopProvinces(){
    const result = await db.query(`SELECT COUNT(pro.idProducto)as value ,de.Departamento as name FROM producto pro
    INNER JOIN departamento de ON de.idDepartamento=pro.idDepartamentoProducto
    WHERE pro.idEstadoProducto<>2
    GROUP BY de.idDepartamento
    ORDER BY value desc;`);
    if (!result) { return [];}
    return result;
}
module.exports={
    unsubscribeUser,
    unsubscribeProduct,
    unsubscribeUser2,
    unsubscribeProduct2,
    userByDate,
    userByYear,
    getTopUsers,
    getTopCategory,
    getTopProvinces
}