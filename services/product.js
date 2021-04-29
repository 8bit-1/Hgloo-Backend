const db = require('./db');
const exchangesRates = require('./triggers-actions').exchangesRates;

async function getProduct(idUser){
    const result = await db.queryP(`SELECT producto.idProducto, producto.Producto,
    ciudad.nombreCiudad, pais.pais,condicion.condicion,
    CONCAT(producto.costo, " ", moneda.Moneda) AS costo, MIN(imagenesurl.idImagenesURL) AS idImagen, imagenesurl.urlImagenProducto as imagen,
    CONVERT( producto.fechaPublicacion,char) AS datep FROM producto 
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
        `SELECT HglooApp.nuevoProducto(?,?,?,?,?,?,?,?,?,?) as idProducto`,
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
         
    );

    Producto.images.forEach( async (element) => {
        await db.queryP(
            `INSERT INTO imagenesurl(urlImagenProducto,idProducto) values (?,?)
            `,
            [   
                element, 
                result[0].idProducto
            ]
        );  
        
    });

    let message = `Error inserting product`;

    if (result[0].idProducto) {
        savedProduct = await getProductById( result[0].idProducto );
        message = { Ok: 1, product: savedProduct };
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
        ORDER BY datep DESC
        LIMIT 0, 20`);
    if (!result) { return [];}
    return result;
}

async function getAllProductsUserLogged( uid, pages, coin ) {
    const result = await db.queryP(`WITH productos AS (
        SELECT ROW_NUMBER() OVER(ORDER BY producto.fechaPublicacion DESC) AS maxAmount, producto.idProducto as idProduct, producto.usuario, producto.Producto as productName,
        CONCAT(ciudad.nombreCiudad,", ",pais.pais) as location,condicion.condicion as state,
        producto.costo, moneda.Moneda, producto.idMoneda as idMoneda, MIN(imagenesurl.idImagenesURL) AS idImage, imagenesurl.urlImagenProducto as imgURL,CONVERT( producto.fechaPublicacion,char) AS datep  FROM producto 
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
        costo, Moneda, idMoneda, imgURL, datep FROM  productos
        ORDER BY maxAmount ASC
        LIMIT ${ pages }, 20;`);
    if (!result) { return [];}

    result.forEach( ( producto, index ) => {
        if ( producto.idMoneda != coin ) {
            if ( producto.idMoneda == 1 ) {
                result[index].costo = (producto.costo / exchangesRates[`${producto.idMoneda}`].HNL).toFixed();
                result[index].Moneda = 'Dolares($)';
            } else {
                result[index].costo = (producto.costo * exchangesRates[ `${producto.idMoneda}` ].HNL).toFixed();
                result[index].Moneda = 'Lempiras(Lps)';
            }
        }
    });
    return result; 
}

async function getProductByQuery( query ) {
    let where = await madeWhere( query );
    let orderBy = await madeOrderBy( query );
    let queryP = '';
    let queryFilterProduct = `
    SELECT DISTINCT pro.idProducto as idProduct, pro.Producto as productName, pro.fechaPublicacion as date, 
    pro.costo, " ", mon.Moneda, mon.idMoneda, cat.nombreCategoria,
    CONCAT( ciu.nombreCiudad, ", ", pais.Pais ) as location, con.condicion as state, 
    MIN( img.urlImagenProducto ) as imgURL ${ ( query.calificacion != '' ) ? ', usr.calificacion' : '' }  FROM producto as pro 
    INNER JOIN categoria as cat 
    ON cat.idCategoria = pro.idCategoriaProducto 
    INNER JOIN departamento as dep 
    ON dep.idDepartamento = pro.idDepartamentoProducto 
    INNER JOIN pais as pais 
    ON pais.idPais = dep.idPais
    INNER JOIN ciudad as ciu 
    ON pro.idCiudadProducto = ciu.idCiudad 
	AND  pro.idDepartamentoProducto = ciu.idDepartamento
	AND pro.idPaisProducto = ciu.idPais 
    INNER JOIN moneda as mon 
    ON mon.idMoneda = pro.idMoneda 
    INNER JOIN condicion as con 
    ON con.idCondicion = pro.idCondicion 
    INNER JOIN imagenesurl as img 
    ON img.idProducto = pro.idProducto
    ${ ( query.calificacion != '' ) ? 'INNER JOIN ( SELECT calificacion.Calificado, CAST(AVG(calificacion)  AS DECIMAL(10,0)) AS calificacion FROM calificacion GROUP BY Calificado ) as usr ON usr.Calificado = pro.usuario' : '' } `;

    queryFilterProduct += where;
    copyQueryFilterProduct = '';

    if ( query.moneda != '' ) {
        copyQueryFilterProduct = queryFilterProduct;
        if ( query.moneda == 1 ) {
            queryFilterProduct += `${ ( where != '' ) ? ' AND ' : 'WHERE' } pro.idMoneda = 1 AND pro.costo BETWEEN ${ query.precio.min } AND ${ query.precio.max }`;
            copyQueryFilterProduct += ` ${ ( where != '' ) ? ' AND ' : 'WHERE' } pro.idMoneda = 2 AND pro.costo BETWEEN ${ (query.precio.min / exchangesRates[2].HNL).toFixed(2) } AND ${ ( query.precio.max / exchangesRates[2].HNL).toFixed(2) }`;
        } else {
            queryFilterProduct += ` ${ ( where != '' ) ? ' AND ' : 'WHERE' } pro.idMoneda = 2 AND pro.costo BETWEEN ${ query.precio.min } AND ${ query.precio.max }`;
            copyQueryFilterProduct += ` ${ ( where != '' ) ? ' AND ' : 'WHERE' } pro.idMoneda = 1 AND pro.costo BETWEEN ${ (query.precio.min * exchangesRates[2].HNL).toFixed(2) } AND ${ (query.precio.max * exchangesRates[2].HNL).toFixed(2) }`;
        }
    }

    queryFilterProduct += ' GROUP BY pro.idProducto ';
    copyQueryFilterProduct += ( copyQueryFilterProduct !== '' ) ? ' GROUP BY pro.idProducto ' : '';

    queryFilterProduct += orderBy;
    copyQueryFilterProduct += ( copyQueryFilterProduct !== '' ) ? orderBy : '';
   
    if ( query.moneda != '' ) {
        queryP = `WITH lempiras AS (` + queryFilterProduct + `), dolares AS (`+ copyQueryFilterProduct +`) SELECT * FROM lempiras UNION SELECT * FROM dolares ORDER BY idProduct DESC`;
        productsFilteredLength = await db.queryP( queryP ).length;
        productsFiltered = await db.queryP( queryP + ' LIMIT 0, 20;' );
        return { amount: productsFilteredLength, products: productsFiltered };
    } else { 
        queryP = queryFilterProduct + `ORDER BY idProduct`;
        productsFilteredLength = await db.queryP( queryP );
        productsFilteredLength = productsFilteredLength.length;
        productsFiltered = await db.queryP( queryP + ' LIMIT 0, 20;' );
        return { amount: productsFilteredLength, products: productsFiltered };
    }
}

function madeWhere( query ) {
    let sqlSyntax = '';
    const whereArray = [
        {
          sql: ' pro.idCategoriaProducto = ' + query.categoria,
          insert: ( query.categoria != '' ) ? true : false,
          next: ' AND ',
        },
        {
          sql: ' pro.idDepartamentoProducto = ' + query.departamento,
          insert: ( query.departamento != '' ) ? true : false,
          next: ' AND ',
        },
        {
          sql: ' pro.idCiudadProducto = ' + query.ciudad,
          insert: ( query.ciudad != '' ) ? true : false,
          next: ' AND ',
        },
        {
          sql: ' pro.fechaPublicacion BETWEEN ' +  '"' + query.fecha.inicio + '"' + ' AND ' +
          '"' + query.fecha.final + '"',
          insert: ( query.fecha.inicio !== '' && query.fecha.final !== '' ) ? true : false,
          next: ' AND ',
        },
        {
          sql: ' usr.calificacion >= ' + query.calificacion,
          insert: ( query.calificacion != '' ) ? true : false,
          next: ' AND ',
        },
        {
            sql: ' pro.idEstadoProducto<>2 ',
            insert: true,
            next: ' AND ',
        },
    ];

    for (let index = 0; index < whereArray.length; index++) {
      if ( whereArray[ index ].insert ) {
        sqlSyntax += 'WHERE ';
        break;
      }
    }

    if ( sqlSyntax == 'WHERE ' ) {
        whereArray.forEach( ( sql, index ) => {
          if ( sql.insert ) {
            let seeFuture = false;
            for ( let i = index; i < whereArray.length - 1; i++ ) {
                if ( whereArray[i].insert ) {
                    seeFuture = true;
                    break;
                } 
            }
            sqlSyntax += ( seeFuture ) ? sql.sql + sql.next : sql.sql;
            whereArray[ index ].insert = false;
          }
        });
    }

    return sqlSyntax;
}

function madeOrderBy( query ) {
    sqlSyntax = '';
    const orderByArray = [
        {
          sql: ' pro.costo ' + query.orderByPrice,
        insert: ( query.orderByPrice != '' ) ? true : false,
          next: ' , ',
        },
        {
          sql: ' pro.fechaPublicacion ' + query.orderByDate,
          insert: ( query.orderByDate ) ? true : false,
          next: ' , ',
        },
      ];
    
    for (let index = 0; index < orderByArray.length; index++) {
      if ( orderByArray[ index ].insert ) {
         sqlSyntax += ' ORDER BY ';
        break;
      }
    }

    if ( sqlSyntax == ' ORDER BY ' ) {
        orderByArray.forEach( ( sql, index ) => {
            if ( sql.insert ) {
                sqlSyntax += ( orderByArray[index + 1 ]?.insert != undefined ) ? sql.sql + sql.next : sql.sql;
            }
        });
    }

    return sqlSyntax;
}

async function searchProduct( word ) {
    const result = await db.queryP( `SELECT DISTINCT pro.idProducto as idProduct, pro.Producto as productName, pro.usuario, 
                                     pro.fechaPublicacion as date, CONCAT(pro.costo, " ", mon.Moneda) AS price, 
                                     mon.idMoneda, cat.nombreCategoria, CONCAT(ciu.nombreCiudad,", ",pais.pais) as location, con.condicion, MIN(img.idImagenesURL) AS idImage, img.urlImagenProducto as imgURL 
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

async function getAmoundProduct( id ) {
    let query = '';
    if ( id == '' ) {
        query = `SELECT ROW_NUMBER() OVER(ORDER BY idProducto ASC) AS maxAmount FROM producto 
        ORDER BY maxAmount DESC LIMIT 1;`
    } else {
        query = `SELECT ROW_NUMBER() OVER(ORDER BY idProducto ASC) AS maxAmount FROM producto 
        WHERE producto.usuario <> '${id}' ORDER BY maxAmount DESC LIMIT 1;`
    }
    const result = await db.queryP( query );
    
    if ( !result ) { return 0; }
    return result;
}

async function getProductById( idProduct ) {
    const result = await db.queryP(`
    SELECT  producto.idProducto as idProduct, producto.usuario, producto.Producto as productName,
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
        AND producto.idProducto = ${ idProduct }
        GROUP BY producto.idProducto
        `);

        if ( !result ) { return []; }
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