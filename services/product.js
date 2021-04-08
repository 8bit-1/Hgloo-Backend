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

async function Productbyname(Product){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND MATCH(Producto) Against (?)
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Product]
    );
    if (result.length==0) { return ['No se encontraron resultados para esta busqueda'];}
    const resultados=result.length;
    result=result[0];
    result["Resultados"]=resultados;
    return result;
}    
            
async function ProductbyCatProCi(Category,Province,City){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idCategoriaProducto=? AND producto.idDepartamentoProducto=? AND producto.idCiudadProducto=?
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Category,Province,City]
    );
      return result;
}    

async function ProductbyCatPro(Category,Province){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idCategoriaProducto=? AND producto.idDepartamentoProducto=? 
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Category,Province]
    );
      return result;
}    

async function ProductbyCatCy(Category,City){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idCategoriaProducto=? AND  producto.idCiudadProducto=?
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Category,City]
    );
      return result;
}    

async function ProductbyProCy(Province,City){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idDepartamentoProducto=? AND producto.idCiudadProducto=?
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Province,City]
    );
      return result;
}    
async function ProductbyCategory(Category){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idCategoriaProducto=? 
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Category]
    );
      return result;
}    
async function ProductbyProvince(Province){
    let result = await db.queryP(
        `SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
        CONCAT(ciudad.nombreCiudad, ", ", pais.pais) AS location,  condicion.condicion AS state,
        CONCAT(producto.costo, " ", moneda.Moneda) AS price  FROM producto 
        INNER JOIN ciudad ON producto.idCiudadProducto=ciudad.idCiudad 
        AND  producto.idDepartamentoProducto=ciudad.idDepartamento
        AND producto.idPaisProducto=ciudad.idPais 
        INNER JOIN departamento ON producto.idDepartamentoProducto=departamento.idDepartamento
        INNER JOIN pais ON producto.idPaisProducto=pais.idPais
        INNER JOIN condicion ON producto.idCondicion=condicion.idCondicion
        INNER JOIN moneda ON producto.idMoneda=moneda.idMoneda
        INNER JOIN imagenesurl ON imagenesurl.idProducto=producto.idProducto
        WHERE  producto.idEstadoProducto<>2
        AND producto.idDepartamentoProducto=? 
        AND imagenesurl.idProducto=producto.idProducto
        GROUP BY producto.idProducto
        ORDER BY producto.fechaPublicacion DESC`,
        [Province]
    );
      return result;
}    

async function homeProduct(idProduct){
    let result = await db.queryP(`SELECT producto.idProducto AS id, producto.Producto AS productName, producto.descripcion,
    CONCAT(ciudad.nombreCiudad,", ",departamento.Departamento ,", ", pais.pais) AS location,  condicion.condicion AS state,
    CONCAT(producto.costo, " ", moneda.Moneda) AS price ,categoria.nombreCategoria AS category, producto.fechaPublicacion AS publicationDate FROM producto 
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
    const result3 = await db.queryP(`SELECT c.Comentador as id ,u.urlfotoPerfil,CONCAT(u.nombreUsuario," ",u.apellidoUsuario) as nombre,u.correo,c.comentario, CONVERT(c.fecha,char) AS fecha from comentario c
                                    INNER JOIN usuario u ON c.comentador=u.idUsuario
                                    INNER JOIN producto p ON c.idProductoComentado= p.idProducto
                                    where c.idProductoComentado is not null AND c.idProductoComentado=? ORDER BY c.fecha DESC`,[idProduct]);
   const result4 = await db.queryP(`SELECT u.idUsuario, CONCAT(u.nombreUsuario," ",u.apellidoUsuario) as nombre, u.correo, u.telefono FROM usuario u
                                   INNER JOIN producto p ON p.usuario= u.idUsuario where p.idProducto=?`,[idProduct]);                                
    const result5 = await db.queryP(`SELECT rs.Redes,ru.urlRedSocial as url FROM redesUsuario ru
                                    INNER JOIN redesSociales rs ON ru.idRedSocial=rs.idredesSociales
                                    INNER JOIN usuario u ON ru.idUsuarioRed=u.idUsuario
                                    INNER JOIN producto p ON p.usuario=u.idUsuario
                                    where p.idProducto=? AND ru.urlRedSocial<>""`,[idProduct]);
    result=result[0];
    result["imagenes"]=imagenes;
    result["comentarios"]=result3;
    result["usuario"]=result4;
    result["redesSociales"]=result5;
    return [result];
}    


async function getAllProducts(){
    const result = await db.queryP(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais,condicion.condicion,
    CONCAT(producto.costo, " ", moneda.Moneda) AS costo, MIN(imagenesurl.urlImagenProducto) AS imagen,CONVERT( producto.fechaPublicacion,char) AS fecha  FROM producto 
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
    ORDER BY producto.fechaPublicacion DESC LIMIT 25`);
    if (!result) { return [];}
    return result;
}



module.exports={
    getProduct,
    getCountProduct,
    registerProduct,
    deleteProduct,
    Productbyname,
    ProductbyCatProCi,
    ProductbyCatPro,
    ProductbyCatCy,
    ProductbyProCy,
    ProductbyProvince,
    ProductbyCategory,
    homeProduct,
    getAllProducts
}