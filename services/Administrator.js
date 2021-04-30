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
            INNER JOIN denuncia ON denuncia.idDenuncia=denunciaProducto.idDenunciaP 
            WHERE  producto.idEstadoProducto<>2
            AND denuncia.idEstadoDenuncia<>2
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
        WHERE p.idProducto=? AND d.idEstadoDenuncia<>2`,
        [idProductos[i].idProductoP]);
        
        otro=[];
        for (var j=0; j<denuncia.length; j++){ 
            otro.push(denuncia[j]);
            whistleblower= await  db.queryP(` SELECT idUsuario, urlfotoPerfil, CONCAT(nombreUsuario,' ',apellidoUsuario) nombreUsuario, correo FROM usuario 
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



async function productsByDate(){
    let años=[]
    años= await db.queryP(`SELECT DISTINCT(YEAR(fechaPublicacion)) as year FROM producto`)
    let data=[];

    for(var j=0;j<años.length;j++){
        años[j]["data"]=await db.queryP(`SELECT MONTHNAME(fechaPublicacion)as month,COUNT(idProducto) as products FROM producto 
        where YEAR(fechaPublicacion)=? GROUP BY MONTH(fechaPublicacion)`,[años[j].year])    
    }

    return años;
}   

async function getCantReports(date_min,date_max){
    let result = await db.queryP(`select COUNT(dp.idReporte)  productos from denuncia d 
    INNER JOIN denunciaProducto dp ON d.idDenuncia=dp.idDenunciaP 
    INNER JOIN reporte r ON dp.idReporte=r.idReporte 
    WHERE d.fechaDenuncia BETWEEN "${date_min}" AND "${date_max}" `);

    const denunciaUser= await db.queryP(`select COUNT(du.idReporteUsuario) cantidad from denuncia d 
    INNER JOIN denunciaUsuario du ON d.idDenuncia=du.idDenunciaU
    INNER JOIN reporteUsuario ru ON du.idReporteUsuario=ru.idReporteUsuario 
    WHERE d.fechaDenuncia BETWEEN "${date_min}" AND "${date_max}"`) 
    
    const denunciaComment= await db.queryP(`select COUNT(dc.idReporteComentario) cantidad from denuncia d 
    INNER JOIN denunciaComentario dc ON d.idDenuncia=dc.idDenunciaC 
    INNER JOIN reporteComentario rc ON dc.idReporteComentario=rc.idReporteComentario
    WHERE d.fechaDenuncia BETWEEN "${date_min}" AND "${date_max}"`);  

    result=result[0];
    result["usuarios"]=denunciaUser[0].cantidad;
    result["Comentarios"]=denunciaComment[0].cantidad;
    
    return result;
}


async function getComplaintUsers(){
    const idDenunciados = await db.queryP(`select du.idDenunciadoU from denuncia d 
                                        INNER JOIN denunciaUsuario du ON d.idDenuncia=du.idDenunciaU
                                        INNER JOIN reporteUsuario ru ON du.idReporteUsuario=ru.idReporteUsuario 
                                        WHERE d.idEstadoDenuncia<>2
                                        GROUP by du.idDenunciadoU
                                        ORDER BY du.idDenunciadoU`);
   
    let Denunciado = await  db.queryP(`SELECT du.idDenunciadoU as id,CONCAT(u.nombreUsuario,' ',u.apellidoUsuario) as userName,u.urlFotoPerfil as imgURL,u.correo as email FROM denunciaUsuario du 
                                        INNER JOIN usuario u ON du.idDenunciadoU=u.idUsuario
                                        INNER JOIN denuncia d ON d.idDenuncia=du.idDenunciaU
                                        WHERE u.idEstado<>2 AND  d.idEstadoDenuncia<>2
                                        GROUP BY du.idDenunciadoU
                                        ORDER BY du.idDenunciadoU`);  
       
    
    let denuncias={};
    let denuncia=[];
    let whistleblower=[];
    let otro=[];
    let result=[];
    for (var i=0; i<idDenunciados.length; i++){ 
        denuncia= await  db.queryP(`SELECT d.idDenuncia as idComplaint,du.idDenunciadoU as idDenounced, du.idDenuncianteU as whistleblower, r.reporte as report, CONVERT(d.fechaDenuncia,CHAR) as dateComplaint, d.descripcionDenuncia as commentary FROM denuncia d
        INNER JOIN denunciaUsuario du ON d.idDenuncia= du.idDenunciaU
        INNER JOIN reporte r ON du.idReporteUsuario=r.idReporte
        WHERE du.idDenunciadoU=? AND d.idEstadoDenuncia<>2`,
        [idDenunciados[i].idDenunciadoU]);
        
        otro=[];
        for (var j=0; j<denuncia.length; j++){ 
            otro.push(denuncia[j]);
            whistleblower= await  db.queryP(`SELECT idUsuario, urlfotoPerfil, CONCAT(nombreUsuario,' ',apellidoUsuario) nombreUsuario, correo FROM usuario 
             where idUsuario=?`,[denuncia[j].whistleblower]);
            otro[j]["Denunciante"]=whistleblower[0];    
        }
        denuncias[i]=otro;
        
    }
    
    for (var i=0; i<idDenunciados.length; i++){
        result.push({Usuario:Denunciado[i],Denuncias:denuncias[i]}); 
    }
    return result;
}


async function getComplaintComments(){
    const idComentarios = await db.queryP(`select dc.idComentarioC from denuncia d  INNER JOIN denunciaComentario dc ON d.idDenuncia=dc.idDenunciaC
                                          WHERE d.idEstadoDenuncia<>2
                                          GROUP by dc.idComentarioC
                                          ORDER BY dc.idComentarioC`);
   
    let Comentario= await  db.queryP(`SELECT c.idComentarios as idComentario,CONCAT(u.nombreUsuario,' ',apellidoUsuario) comentador,u.urlfotoPerfil,u.correo,c.comentario, CONVERT(c.fecha,CHAR)as fecha from comentario c
                                    INNER JOIN usuario u ON c.comentador=u.idUsuario
                                    INNER JOIN denunciaComentario dc ON c.idComentarios=dc.idComentarioC
                                    INNER JOIN denuncia d ON dc.idDenunciaC=d.idDenuncia
                                    WHERE d.idEstadoDenuncia<>2
                                    GROUP by dc.idComentarioC
                                    ORDER BY dc.idComentarioC;`);  
       
    
    let denuncias={};
    let denuncia=[];
    let whistleblower=[];
    let otro=[];
    let result=[];
    for (var i=0; i<idComentarios.length; i++){ 
        denuncia= await  db.queryP(` SELECT d.idDenuncia AS idComplaint, u.idUsuario as idDenounced, dc.idDenuncianteC  AS whistleblower,
         rc.reporteComentario AS report, CONVERT( d.fechaDenuncia,char) AS dateComplaint FROM denunciaComentario dc
         INNER JOIN  denuncia as d ON d.idDenuncia=dc.idDenunciaC
         INNER JOIN comentario c ON c.idComentarios=dc.idComentarioC
         INNER JOIN usuario u ON u.idUsuario=c.comentador
         INNER JOIN reporteComentario rc ON rc.idReporteComentario=dc.idReporteComentario
         WHERE c.idComentarios=?`,
        [idComentarios[i].idComentarioC]);
        
        otro=[];
        for (var j=0; j<denuncia.length; j++){ 
            otro.push(denuncia[j]);
            whistleblower= await  db.queryP(`SELECT idUsuario, urlfotoPerfil, CONCAT(nombreUsuario,' ',apellidoUsuario) nombreUsuario, correo FROM usuario 
             where idUsuario=?`,[denuncia[j].whistleblower]);
            otro[j]["Denunciante"]=whistleblower[0];    
        }
        denuncias[i]=otro;
        
    }
    
    for (var i=0; i<idComentarios.length; i++){
        result.push({Comentario:Comentario[i],Denuncias:denuncias[i]}); 
    }
    return result;
}

async function evaluateComplaintProduct(Product,idProduct){
    let result = await db.queryP(
        `SELECT idDenunciaP FROM denunciaProducto WHERE idProductoP=?`,
        [idProduct]);

    for (var j=0; j<result.length; j++){ 
        const denuncia = await db.queryP(
            `UPDATE denuncia set idEstadoDenuncia=2 WHERE idDenuncia=?`,
            [result[j].idDenunciaP]);   
        }
    const denuncia = await db.queryP(
        `UPDATE producto set idEstadoProducto=? WHERE idProducto=?`,
        [Product.idEstate, idProduct]);


    if(Product.idEstate==2){
        const notificacion = await db.queryP (`INSERT INTO notificaciones (idUsuarioNot, idProductoNot, mensaje,visto)
                            VALUES ((SELECT usuario from producto where idProducto=?), ?, 
                            CONCAT("El producto ", (SELECT Producto from producto where idProducto=?), 
                            " ha sido dado de baja por que ha recibido denuncias, comuníquese al correo hgloo.app.c@gmail.com si considera que el producto no debió ser dado de baja"),1)`,[idProduct, idProduct, idProduct]);
        
    }
    let message = 'Error evaluating Complaint';

    if (denuncia.affectedRows) {
        message = 'Complaint evaluated sucessfully';
    }

    return message;
}

async function evaluateComplaintUser(User,idUser){
    let result = await db.queryP(
        `SELECT idDenunciaU FROM denunciaUsuario WHERE idDenunciadoU=?`,
        [idUser]);

    for (var j=0; j<result.length; j++){ 
        const denuncia = await db.queryP(
            `UPDATE denuncia set idEstadoDenuncia=2 WHERE idDenuncia=?`,
            [result[j].idDenunciaU]);   
        }
        const denuncia = await db.queryP(
            `UPDATE usuario set idEstado=? WHERE idUsuario=?`,
            [User.idEstate, idUser]);

    let message = 'Error evaluating Complaint';

    if (denuncia.affectedRows) {
        message = 'Complaint evaluated sucessfully';
    }

    return message;
}

async function evaluateComplaintComments(Comment,idCommentary){
    let result = await db.queryP(
        `SELECT idDenunciaC FROM denunciaComentario WHERE idComentarioC=?`,
        [idCommentary]);

    for (var j=0; j<result.length; j++){ 
        const denuncia = await db.queryP(
            `UPDATE denuncia set idEstadoDenuncia=2 WHERE idDenuncia=?`,
            [result[j].idDenunciaC]);   
        }
        const denuncia = await db.queryP(
            `UPDATE comentario set idEstadoComentario=? WHERE idComentarios=?`,
            [Comment.idEstate, idCommentary]);

    let message = 'Error evaluating Complaint';

    if (denuncia.affectedRows) {
        message = 'Complaint evaluated sucessfully';
    }

    return message;
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
    getComplaintProducts,
    productsByDate,
    getCantReports,
    getComplaintUsers,
    getComplaintComments,
    evaluateComplaintProduct,
    evaluateComplaintUser,
    evaluateComplaintComments
}