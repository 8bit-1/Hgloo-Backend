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
            `SELECT producto.idProducto as idProducto, usuario.idUsuario as idUsuario,  CONCAT(usuario.nombreUsuario," ",usuario.apellidoUsuario) as nombre,
            usuario.urlFotoPerfil as fotoPerfil FROM usuario 
            INNER JOIN producto ON producto.usuario=usuario.idUsuario
            INNER JOIN publicidad ON publicidad.idProductoPublicidad=producto.idProducto
            WHERE producto.idEstadoProducto<>2
            AND usuario.idEstado<>2`);  
       
    
    let imagenes=[];
    let imagen=[];
    let otro=[];
    for (var i=0; i<idProductos.length; i++){ 
        imagen= await  db.queryP(` SELECT imagenesurl.urlImagenProducto as imagen FROM imagenesurl 
        INNER JOIN producto ON producto.idProducto=imagenesurl.idProducto
        INNER JOIN publicidad ON publicidad.idProductoPublicidad=producto.idProducto 
        WHERE publicidad.idProductoPublicidad=? LIMIT 3 `,
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

async function postEmail(){
    const idUsuarios = await db.queryP(`SELECT idUsuario FROM usuario ORDER BY idUsuario`);
   
    let result = await  db.queryP(
            `SELECT CONCAT(nombreUsuario," ", apellidoUsuario) as Nombre, correo FROM usuario ORDER BY idUsuario`);  
       
    
    let categorias=[];
    let categoria=[];
    let otro=[];
    for (var i=0; i<idUsuarios.length; i++){ 
        categoria= await  db.queryP(` SELECT idCategoria FROM categoriausuario where idUsuario=? `,
        [idUsuarios[i].idUsuario]);
        otro=[];
        for (var j=0; j<categoria.length; j++){ 
            otro.push(categoria[j].idCategoria);

        }
        categorias[i]=otro;
    }
    
    for (var i=0; i<idUsuarios.length; i++){ 
        result[i]["Categorias"]=categorias[i];
    }

    
    let products=[];
    let producto=[];
    let cat=[];

    for (var i=0; i<idUsuarios.length; i++){ 
        cat=[];
        cat= await  db.queryP(` SELECT cu.idCategoria, c.nombreCategoria FROM categoriausuario cu 
                                                INNER JOIN categoria c ON c.idCategoria=cu.idCategoria 
                                                where cu.idUsuario=? `,
        [idUsuarios[i].idUsuario]);
        products[i]=[];
        for (var j=0; j<cat.length; j++){ 
            producto=[];
            producto= await  db.queryP(` SELECT producto.idProducto, producto.Producto,
            ciudad.nombreCiudad, 
            MIN(imagenesurl.urlImagenProducto) AS imagen, CONVERT(producto.fechaPublicacion,char) as Fecha  FROM producto 
            INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
            AND  producto.idDepartamentoProducto=ciudad.idDepartamento
            AND producto.idPaisProducto=ciudad.idPais 
            INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
            INNER JOIN pais ON producto.idPaisProducto=pais.idPais
            INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
            INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
            INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
            WHERE  producto.idEstadoProducto<>2
            AND producto.fechaPublicacion>=(DATE_SUB(CONVERT_TZ( NOW(),'Europe/London','America/Tegucigalpa'),INTERVAL (SELECT dias FROM emailPublicidad )DAY))
            AND imagenesurl.idProducto=producto.idProducto
            AND producto.idCategoriaProducto=?
            GROUP BY producto.idProducto
            ORDER BY producto.fechaPublicacion DESC; `,
            [cat[j].idCategoria]);
            otros=[];
            const productoxCat={};
            productoxCat[cat[j].nombreCategoria]=producto;
            productoxCat["Codigo"]=cat[j].idCategoria;
            products[i].push(productoxCat);
        }
          
    }
    
    for (var i=0; i<idUsuarios.length; i++) {
        delete result[i]["Categorias"];
        result[i]["Productos"] = products[i];
    }
    return result;
}

module.exports = {
    Publicity,
    getPublicity,
    postEmail
}