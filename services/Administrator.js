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
    const result = await db.query(`SELECT de.Departamento as name, COUNT(pro.idProducto) value FROM producto AS pro
    INNER JOIN departamento de ON de.idDepartamento=pro.idDepartamentoProducto
    WHERE pro.idEstadoProducto<>2
    GROUP BY de.idDepartamento
    ORDER BY value desc;`);
    if (!result) { return [];}
    return result;
}


async function getComplaintProducts(){
    const idProductos = await db.queryP(`SELECT dp.idProductoP FROM denunciaProducto dp INNER JOIN denuncia d
                                        ON d.idDenuncia=dp.idDenunciaP
                                        WHERE d.idEstadoDenuncia<>2
                                        GROUP BY idProductoP
                                        ORDER BY idProductoP`);
   
    let Products = await  db.queryP(
            `SELECT producto.idProducto AS id, producto.Producto AS productName, CONCAT(producto.costo, " ", moneda.Moneda) AS price,
            CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  producto.descripcion AS descrip, 
            MIN(imagenesurl.idProducto) as idImage, imagenesurl.urlImagenProducto AS imgURL  FROM producto 
            INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
            AND  producto.idDepartamentoProducto=ciudad.idDepartamento
            AND producto.idPaisProducto=ciudad.idPais 
            INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
            INNER JOIN pais ON producto.idPaisProducto=pais.idPais
            INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
            INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
            INNER JOIN denunciaProducto ON denunciaProducto.idProductoP=producto.idProducto
            WHERE  producto.idEstadoProducto<>2
            GROUP BY denunciaProducto.idProductoP
            ORDER BY denunciaProducto.idProductoP`);  
       
    
    let denuncias={};
    let denuncia=[];
    let whistleblower=[];
    let otro=[];
    let result=[];
    for (var i=0; i<idProductos.length; i++){ 
        denuncia= await  db.queryP(` SELECT d.idDenuncia AS idComplaint, u.idUsuario as idDenounced, dp.idDenuncianteP  AS whistleblower, r.reporte AS report, CONVERT( d.fechaDenuncia,char) AS dateComplaint, d.descripcionDenuncia AS commentary FROM denunciaProducto  dp
        INNER JOIN  denuncia as d ON d.idDenuncia=dp.idDenunciaP
        INNER JOIN producto p ON p.idProducto=dp.idProductoP
        INNER JOIN usuario u ON u.idUsuario=p.usuario
        INNER JOIN reporte r ON r.idReporte=dp.idReporte
        WHERE p.idProducto=?`,
        [idProductos[i].idProductoP]);
        
        otro=[];
        for (var j=0; j<denuncia.length; j++){ 
            otro.push(denuncia[j]);
            whistleblower= await  db.queryP(` SELECT idUsuario, urlfotoPerfil, nombreUsuario, correo FROM usuario 
            where idUsuario=?`,
            [denuncia[j].whistleblower]);
            otro[j]["Denunciante"]=whistleblower[0];    
        }
        denuncias[i]=otro;
        
    }
    
    for (var i=0; i<idProductos.length; i++){
        result.push({Producto:Products[i],Denuncias:denuncias[i]}); 
        // result[i]["Producto"]=Products[i];
        // result[i]["denuncias"]=denuncias[i];
    }
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
    getTopProvinces,
    getComplaintProducts
}