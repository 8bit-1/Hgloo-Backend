const db = require('./db');


async function getNotification(idUser){
    let result = await db.queryP(`SELECT idNotificaciones as idNotificacion,idUsuarioNot as usuario,mensaje,idProductoNot as idProducto,
                                   CONVERT(fecha, CHAR) as fecha from notificaciones
                                    where idUsuarioNot=? AND visto<>2`,[idUser]);
    let notification=[];
    for(var i=0;i<result.length;i++){
        const idImagen=await db.queryP(`SELECT MIN(idImagenesURL)as id FROM imagenesurl where idProducto = ?`,[result[i].idProducto]);
        const Imagen=await db.queryP(`SELECT urlImagenProducto as imagen FROM imagenesurl where idImagenesURL = ?`,[idImagen[0].id]);
        result[i]["imagen"]=Imagen[0].imagen
    }
    
    if (!result) { return [];}
    return result;
}


async function viewNotificacion(idNotificacion){
    const result = await db.queryP(`UPDATE notificaciones SET visto=2 WHERE idnotificaciones=?`, [idNotificacion]);

    let message = 'Error updating notifications';

    if (result.affectedRows) {
        message = 'Notification evaluated sucessfully';
    }

    return message;
}




module.exports={
    getNotification,
    viewNotificacion
}