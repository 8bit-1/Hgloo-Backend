const db = require('./db');

async function Publicity(idUser, idProduct){
    const result = await db.queryP(
        `INSERT INTO publicidad (idProductoPublicidad) values(?) `,
        [
            idProduct    
        ]
    );

    let message = 'Error inserting publicity';

    if (result.affectedRows) {
        message = 'Publicity inserted sucessfully';
    }

    return message;
}

async function getPublicity(){
    const idProductos = await db.queryP(`SELECT idProductoPublicidad FROM publicidad`);
   
    let result = await  db.queryP(
            `SELECT producto.idProducto as idProducto, usuario.idUsuario as idUsuario,  CONCAT(usuario.nombreUsuario," ",usuario.apellidoUsuario) as nombre FROM usuario 
            INNER JOIN producto ON producto.usuario=usuario.idUsuario
            INNER JOIN publicidad ON publicidad.idProductoPublicidad=producto.idProducto`);  
       
    
    let imagenes=[];
    let imagen=[];
    let otro=[];
    for (var i=0; i<idProductos.length; i++){ 
        imagen= await  db.queryP(` SELECT imagenesurl.urlImagenProducto as imagen FROM imagenesurl 
        INNER JOIN producto ON producto.idProducto=imagenesurl.idProducto
        INNER JOIN publicidad ON publicidad.idProductoPublicidad=producto.idProducto 
        WHERE publicidad.idProductoPublicidad=? `,
        [idProductos[i].idProductoPublicidad]);
        otro=[];
        for (var j=0; j<imagen.length; j++){ 
            otro.push(imagen[j].imagen);

        }
        imagenes[i]=otro;
    }
    
    for (var i=0; i<idProductos.length; i++){ 
        result[i]["imagenes"]=imagenes[i];
    }
    return result;
}    


module.exports = {
    Publicity,
    getPublicity
}