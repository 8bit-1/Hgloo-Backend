const db = require('./db');

async function registerProduct(Product){
    const result = await db.queryP(
        `call registrarProducto(?,?,?,?,?,?,?,?,?,?)`,
        [
            Product.product,
            Product.users,
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

async function getProduct(){
    const result = await db.query(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais, condicion.condicion,
    producto.costo FROM producto 
    INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
    INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
    INNER JOIN pais ON producto.idPaisProducto=pais.idPais
    INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
    WHERE producto.idProducto=producto.idProducto AND
          producto.idCiudadProducto=ciudad.idCiudad AND
          producto.idDepartamentoProducto=ciudad.idDepartamento  AND
          producto.idPaisProducto=ciudad.idPais AND 
          producto.idCondicion=condicion.idCondicion
          AND producto.idEstadoProducto<>2`);
    if (!result) { return [];}
    return result;
}

module.exports={
    registerProduct,
    getProduct
}