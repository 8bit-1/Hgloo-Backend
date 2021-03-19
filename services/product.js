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
    const result = await db.query(`SELECT Producto FROM producto where idEstadoProducto=1`);
    if (!result) { return [];}
    return result;
}

module.exports={
    registerProduct,
    getProduct
}