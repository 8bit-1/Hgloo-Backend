const db = require('./db');

async function getProfile(idUser){
    let result = await db.queryP(`SELECT idUsuario as uid, nombreUsuario, 
    apellidoUsuario, 
    correo, 
    telefono, 
    urlFotoPerfil, 
    pa.Pais, 
    dep.Departamento, 
    ciu.nombreCiudad as Ciudad, 
    ge.Genero  FROM HglooApp.usuario us
    INNER JOIN HglooApp.pais pa
    ON us.idPais = pa.idPais
    INNER JOIN HglooApp.departamento dep
    ON dep.idDepartamento = us.idDepartamento
    INNER JOIN HglooApp.ciudad ciu 
    ON ciu.idCiudad = us.idCiudad
    INNER JOIN HglooApp.genero ge
    ON ge.idGenero = us.idGenero
    WHERE  us.idUsuario = ?
    GROUP BY idUsuario, 
    nombreUsuario, 
    apellidoUsuario,
    correo, 
    telefono, 
    urlFotoPerfil, 
    pa.Pais, 
    dep.Departamento, 
    us.idCiudad,
    ge.Genero;`,[idUser]);
    const cantidadProductos = await db.queryP(`SELECT COUNT(usuario) as CantidadProductos from producto  where usuario=?`,[idUser])
    const calificacion = await db.queryP(`SELECT CAST(AVG(calificacion) AS DECIMAL(10,0)) AS Calificacion FROM calificacion where calificado=?`,[idUser])
    const result2 = await db.queryP(`SELECT u.idUsuario as id ,u.urlfotoPerfil,u.nombreUsuario,u.correo,c.comentario, CONVERT(c.fecha,char) AS fecha from comentario c
    INNER JOIN usuario u ON c.comentador=u.idUsuario
    where c.idProductoComentado is null AND c.Comentado=? ORDER BY c.fecha DESC`,[idUser]);
    const result4 = await db.queryP(`SELECT redesSociales.redes as name, redesUsuario.urlRedSocial as url FROM redesSociales INNER JOIN 	
    redesUsuario ON idRedSocial=idredesSociales
    WHERE redesUsuario.idUsuarioRed=?`,[idUser]);
    const result3 = await db.queryP(`SELECT producto.idProducto AS id, MIN(imagenesurl.urlImagenProducto) AS imgURL, producto.Producto AS productName,
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
    AND producto.usuario=?
    AND imagenesurl.idProducto=producto.idProducto
    GROUP BY producto.idProducto
    ORDER BY producto.fechaPublicacion DESC`,[idUser]);
    const result5 = await db.queryP(`SELECT categoria.idCategoria  FROM usuario
    INNER JOIN categoriausuario
    on usuario.idUsuario=categoriausuario.idUsuario
    INNER JOIN categoria
    ON categoriausuario.idCategoria=categoria.idCategoria where usuario.idUsuario=?
    AND categoria.idEstadoCategoria=1;`,[idUser]);
    result=result[0];
    result["cantidadProductos"]=cantidadProductos[0].CantidadProductos;
    result["calificacion"]=((calificacion[0].Calificacion==null)? 5 :calificacion[0].Calificacion);
    result["comentarios"]=result2;
    result["redesSociales"]=result4;
    result["productos"]=result3;
    result["categorias"]=result5;
    if(result["calificacion"])
    if (!result) { return [];}
    if (!result["comentarios"]) { return [];}
    if (!result["redesSociales"]) { return [];}
    if (!result["productos"]) { return [];}
    if (!result["categorias"]) { return [];}
    return [result];
}


module.exports={
    getProfile   
}