const db = require('./db');

async function getProduct(idUser){
    const result = await db.queryP(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais,condicion.condicion,
    CONCAT(producto.costo, " ", moneda.Moneda) AS costo, MIN(imagenesurl.urlImagenProducto) AS imagen  FROM producto 
    INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
    AND  producto.idDepartamentoProducto=ciudad.idDepartamento
    AND producto.idPaisProducto=ciudad.idPais 
    INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
    INNER JOIN pais ON producto.idPaisProducto=pais.idPais
    INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
    INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
    INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
    WHERE  producto.idEstadoProducto<>2
    AND producto.usuario=?
    AND imagenesurl.idProducto=producto.idProducto
    GROUP BY producto.idProducto
    ORDER BY producto.fechaPublicacion DESC;`,[idUser]);
    if (!result) { return [];}
    return result;
}

async function getCountProduct(idUser){
    const result = await db.queryP(`SELECT COUNT(*) as Products FROM producto where producto.usuario=? AND
    idEstadoProducto<>2`,[idUser]);
    if (!result) { return [];}
    return result;
}

async function registerProduct(Producto,idUser){
    const result = await db.queryP(
        `call registraProducto(?,?,?,?,?,?,?,?,?,?)`,
        [
            Producto.product,
            idUser,
            Producto.description,
            Producto.price,
            Producto.coin, 
            Producto.condition,
            Producto.city,
            Producto.province,
            Producto.country,
            Producto.category
        ]
    );
    Producto.images.forEach(element => {
        const result =  db.queryP(
            `INSERT INTO imagenesurl(urlImagenProducto,idProducto) values (?,(SELECT MAX(idProducto) FROM producto))
            `,
            [   
                element
            ]
        );  
        
    });
    let message = 'Error creating Product';

    if (result.affectedRows) {
        message = 'Product created sucessfully';
    }
    return message;
}

module.exports={
    getProduct,
    getCountProduct,
    registerProduct
}