const db = require('./db');

async function getProduct(idUser){
    const result = await db.queryP(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais,condicion.condicion,
    CONCAT(producto.costo, " ", moneda.Moneda) AS costo, MIN(imagenesurl.idImagenesURL) AS idImagen, imagenesurl.urlImagenProducto as imagen FROM producto 
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
    let max;
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
            Producto.category,           
        ],
        max=await db.query(`SELECT (MAX(idProducto)+1) as idProduct FROM producto`)
         
    );
    Producto.images.forEach(element => {
        const result =  db.queryP(
            `INSERT INTO imagenesurl(urlImagenProducto,idProducto) values (?,?)
            `,
            [   
                element, max[0].idProduct
            ]
        );  
        
    });
    let message = `Error inserting product`;

    if (result.affectedRows) {
        message = max;
    }
    return message;
    
}

async function deleteProduct(idProduct,idUser){
    const result = await db.queryP(
        `UPDATE producto SET idEstadoProducto=2 where idProducto=? and usuario=?`,
        [idProduct,idUser]
    );

    let message = 'Error deleting product';

    if (result.affectedRows) {
        message = 'Product deleted sucessfully';
    }
    return message;
}

async function homeProduct(idProduct){
    let result = await db.queryP(`SELECT producto.idProducto AS id, producto.Producto AS productName, producto.descripcion,
    CONCAT(ciudad.nombreCiudad,", ",departamento.Departamento ,", ", pais.pais) AS location,  condicion.condicion AS state,
    CONCAT(producto.costo, " ", moneda.Moneda) AS price ,categoria.nombreCategoria AS category,CONVERT(producto.fechaPublicacion,char) AS publicationDate FROM producto 
    INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
    AND  producto.idDepartamentoProducto=ciudad.idDepartamento
    AND producto.idPaisProducto=ciudad.idPais 
    INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
    INNER JOIN pais ON producto.idPaisProducto=pais.idPais
    INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
    INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
    INNER JOIN categoria ON producto.idCategoriaProducto=categoria.idCategoria
    WHERE  producto.idEstadoProducto<>2
    AND producto.idProducto=?`,[idProduct]);
    const imagenes = await db.queryP(` SELECT urlImagenProducto as imagenes FROM imagenesurl 
                                      im INNER JOIN producto p ON im.idProducto= p.idProducto
                                      where p.idProducto=?`,[idProduct])
    const result3 = await db.queryP(`SELECT c.idComentarios as idComentario,c.Comentador as id ,u.urlfotoPerfil,CONCAT(u.nombreUsuario," ",u.apellidoUsuario) as nombre,u.correo,c.comentario, CONVERT(c.fecha,char) AS fecha from comentario c
                                    INNER JOIN usuario u ON c.comentador=u.idUsuario
                                    INNER JOIN producto p ON c.idProductoComentado= p.idProducto
                                    where c.idProductoComentado is not null AND c.idProductoComentado=? ORDER BY c.fecha DESC`,[idProduct]);
    const result4 = await db.queryP(`SELECT u.idUsuario, CONCAT(u.nombreUsuario," ",u.apellidoUsuario) as nombre, u.urlFotoPerfil, u.correo, u.telefono FROM usuario u
                                   INNER JOIN producto p ON p.usuario= u.idUsuario where p.idProducto=?`,[idProduct]);                                
    const result5 = await db.queryP(`SELECT rs.Redes,ru.urlRedSocial as url FROM redesUsuario ru
                                    INNER JOIN redesSociales rs ON ru.idRedSocial=rs.idredesSociales
                                    INNER JOIN usuario u ON ru.idUsuarioRed=u.idUsuario
                                    INNER JOIN producto p ON p.usuario=u.idUsuario
                                    where p.idProducto=? AND ru.urlRedSocial<>""`,[idProduct]);

    const productNombre = await db.queryP(`SELECT Producto FROM producto where idProducto=?`,[idProduct]); 
    const productos = await db.queryP(`SELECT producto.idProducto AS id, MIN(imagenesurl.idImagenesURL) AS idImagen, imagenesurl.urlImagenProducto as imagen, producto.Producto AS productName,
    CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
    CONCAT(producto.costo, " ", moneda.Moneda) AS price, CONVERT( producto.fechaPublicacion,char) AS fecha FROM producto 
    INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
    AND  producto.idDepartamentoProducto=ciudad.idDepartamento
    AND producto.idPaisProducto=ciudad.idPais 
    INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
    INNER JOIN pais ON producto.idPaisProducto=pais.idPais
    INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
    INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
    INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
    WHERE  producto.idEstadoProducto<>2
    AND producto.idProducto<>?
    AND (MATCH(Producto) Against (?)
    OR producto.idCategoriaProducto=(SELECT idCategoriaProducto FROM producto where idProducto=?))
    AND imagenesurl.idProducto=producto.idProducto
    GROUP BY producto.idProducto
    ORDER BY producto.Producto, producto.fechaPublicacion DESC LIMIT 10`,[idProduct,productNombre[0].Producto,idProduct]);
    result=result[0];
    result["imagenes"]=imagenes;
    result["comentarios"]=result3;
    result["usuario"]=result4;
    result["redesSociales"]=result5;
    result["Sugerencias"]=productos;
    return [result];
}    


async function getAllProducts( max, min ){
    const result = await db.queryP(`WITH productos AS (
        SELECT ROW_NUMBER() OVER(ORDER BY producto.idProducto ASC) AS maxAmount, producto.idProducto as idProduct, producto.usuario, producto.Producto as productName,
        CONCAT(ciudad.nombreCiudad,", ",pais.pais) as location,condicion.condicion as state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price, MIN(imagenesurl.idImagenesURL) AS idImage, imagenesurl.urlImagenProducto as imgURL,CONVERT( producto.fechaPublicacion,char) AS datep  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY maxAmount ASC
        ) SELECT idProduct, usuario, productName, location , state,
        price, imgURL, datep FROM  productos
        WHERE maxAmount BETWEEN ${ min } AND ${ max }
        ORDER BY datep DESC;`);
    if (!result) { return [];}
    return result;
}

async function getAllProductsUserLogged( uid, max, min ){
    const result = await db.queryP(`WITH productos AS (
        SELECT ROW_NUMBER() OVER(ORDER BY producto.fechaPublicacion DESC) AS maxAmount, producto.idProducto as idProduct, producto.usuario, producto.Producto as productName,
        CONCAT(ciudad.nombreCiudad,", ",pais.pais) as location,condicion.condicion as state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price, MIN(imagenesurl.idImagenesURL) AS idImage, imagenesurl.urlImagenProducto as imgURL,CONVERT( producto.fechaPublicacion,char) AS datep  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND imagenesurl.idProducto=producto.idProducto
        AND producto.usuario <> '${ uid }'
        GROUP BY producto.idProducto
        ORDER BY datep DESC
        ) SELECT idProduct, usuario, productName, location , state,
        price, imgURL, datep FROM  productos
        WHERE maxAmount BETWEEN ${ min } AND ${ max }
        ORDER BY maxAmount ASC;`);
    if (!result) { return [];}
    return result;
}

async function getProductByQuery( query ) {
    console.log( query );
    const result = await db.queryP( query );
    if ( !result ) { return []; }
    return result;
}

async function searchProduct( word ) {
    const result = await db.queryP( `SELECT DISTINCT pro.idProducto as idProduct, pro.Producto as productName, pro.usuario, 
                                     pro.fechaPublicacion as date, CONCAT(pro.costo, " ", mon.Moneda) AS price, 
                                     mon.idMoneda, cat.nombreCategoria, CONCAT(ciu.nombreCiudad,", ",pais.pais) as location, con.condicion, MIN(imagenesurl.idImagenesURL) AS idImage, imagenesurl.urlImagenProducto as imgURL 
                                     FROM producto as pro INNER JOIN categoria as cat ON cat.idCategoria = pro.idCategoriaProducto 
                                    INNER JOIN ciudad as ciu 
                                    ON ciu.idCiudad = pro.idCiudadProducto 
                                    INNER JOIN departamento as dep 
                                    ON dep.idDepartamento = pro.idDepartamentoProducto 
                                    INNER JOIN pais as pais 
                                    ON pais.idPais = dep.idPais 
                                    INNER JOIN moneda as mon 
                                    ON mon.idMoneda = pro.idMoneda 
                                    INNER JOIN condicion as con
                                    ON con.idCondicion = pro.idCondicion 
                                    INNER JOIN imagenesurl as img 
                                    ON img.idProducto = pro.idProducto
                                    WHERE pro.Producto LIKE "%${ word }%"` );
    if ( !result ) { return []; }
    return result;
}

async function getAmoundProduct() {
    const result = await db.queryP(`SELECT ROW_NUMBER() OVER(ORDER BY idProducto ASC) AS maxAmount FROM producto 
        ORDER BY maxAmount DESC LIMIT 1;`);
    
    if ( !result ) { return 0; }
    return result;
}

module.exports={
    getProduct,
    getCountProduct,
    registerProduct,
    deleteProduct,
    homeProduct,
    getAllProducts,
    getProductByQuery,
    searchProduct,
    getAllProductsUserLogged,
    getAmoundProduct,
}