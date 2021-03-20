const db = require('./db');

async function registerProduct(Product,idUser){
    const result = await db.queryP(
        `call registrarProducto(?,?,?,?,?,?,?,?,?,?)`,
        [
            Product.product,
            idUser,
            Product.description, 
            Product.price,  
            Product.coin, 
            Product.condition, 
            Product.city, 
            Product.province, 
            Product.country,
            Product.category
        ]
    );

    let message = 'Error registering Product';

    if (result.affectedRows) {
        message = 'Product registered sucessfully';
    }
    return message;
}

async function getProduct(idUser){
    const result = await db.queryP(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais,condicion.condicion,
    producto.costo FROM producto 
    INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
    AND  producto.idDepartamentoProducto=ciudad.idDepartamento
    AND producto.idPaisProducto=ciudad.idPais 
    INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
    INNER JOIN pais ON producto.idPaisProducto=pais.idPais
    INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
    WHERE  producto.idEstadoProducto<>2
    AND producto.usuario=?
    ORDER BY producto.fechaPublicacion DESC;`,[idUser]);
    if (!result) { return [];}
    return result;
}

module.exports={
    registerProduct,
    getProduct
}