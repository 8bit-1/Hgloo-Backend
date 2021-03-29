const db = require('./db');

async function update(Usuario,idUser){
    const result = await db.queryP(
        `call modificarUsuario(?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
            idUser,
            Usuario.name,
            Usuario.lastname,
            Usuario.phone, 
            Usuario.city,
            Usuario.province,
            Usuario.country,
            Usuario.genre,
            Usuario.coin,
            Usuario.urlWhatsapp,
            Usuario.urlFacebook,
            Usuario.urlInstagram
        ]
    );

    let message = 'Error updating User';

    if (result.affectedRows) {
        message = 'User updated sucessfully';
    }

    return message;
}

async function getQualificationUser(idUser){
    const result = await db.queryP(`SELECT CAST(AVG(calificacion) AS DECIMAL(10,0)) AS Qualification FROM calificacion where calificado=?`,[idUser]);
    if (!result) { return [];}
    return result;
}

async function getUser(idUser){
    const result = await db.queryP(`SELECT nombreUsuario, 
    apellidoUsuario, 
    correo, 
    telefono, 
    urlFotoPerfil, 
    pa.Pais, 
    dep.Departamento, 
    ciu.nombreCiudad, 
    ge.Genero, CAST(AVG(calificacion) AS DECIMAL(10,0)) AS Qualification FROM HglooApp.usuario us
    INNER JOIN HglooApp.pais pa
    ON us.idPais = pa.idPais
    INNER JOIN HglooApp.departamento dep
    ON dep.idDepartamento = us.idDepartamento
    INNER JOIN HglooApp.ciudad ciu 
    ON ciu.idCiudad = us.idCiudad
    INNER JOIN HglooApp.genero ge
    ON ge.idGenero = us.idGenero 
    WHERE us.idUsuario = ?
    GROUP BY nombreUsuario, 
    apellidoUsuario, 
    correo, 
    telefono, 
    urlFotoPerfil, 
    pa.Pais, 
    dep.Departamento, 
    us.idCiudad,
    ge.Genero;`,[idUser]);
    if (!result) { return [];}
    return result;
}

async function addSocialMedia(Redes,idUser){
    const result = await db.queryP(
        `call insertarRedesSociales(?,?,?,?)`,
        [
            idUser,
            Redes.urlWhatsapp,
            Redes.urlFacebook,
            Redes.urlInstagram
        ]
    );

    let message = 'Error inserted SocialMedia';

    if (result.affectedRows) {
        message = 'Social media add sucessfully';
    }

    return message;
}

async function getInfo(idUser){
    const result = await db.queryP( `SELECT CONCAT(nombreUsuario, " ", 
    apellidoUsuario) AS nombre, 
    correo, 
    COUNT(producto.idProducto) as Products, CAST(AVG(calificacion) AS DECIMAL(10,0)) AS Qualification  FROM HglooApp.usuario 
    INNER JOIN HglooApp.producto 
    ON producto.usuario = usuario.idUsuario
    INNER JOIN HglooApp.calificacion 	 
    ON calificacion.Calificado=usuario.idUsuario
    WHERE usuario.idUsuario = ?
	AND producto.idEstadoProducto!=2 
    GROUP BY nombreUsuario, 
    apellidoUsuario, 
    correo,  producto.idProducto;`,[idUser]);
    if (!result) { return [];}
    return result;
}





async function subscribedCategoryUser(idUser){
    const result = await db.queryP(`SELECT categoria.idCategoria ,categoria.nombreCategoria as Categoria FROM usuario
                                    INNER JOIN categoriausuario
                                    on usuario.idUsuario=categoriausuario.idUsuario
                                    INNER JOIN categoria  
                                    ON categoriausuario.idCategoria=categoria.idCategoria where usuario.idUsuario=?
                                    AND categoria.idEstadoCategoria=1;`,[idUser]);
    if (!result) { return [];}
    return result;
}


async function subsCategory(Categories,idUser){
    const result = await db.queryP(
        `INSERT INTO categoriausuario VALUES(?,?);`,[Categories.subsCategory,idUser]
    );

    let message = 'Error suscribed category';

    if (result.affectedRows) {
        message = 'add subscription to category sucessfully';
    }

    return message;
}


async function unsubsCategory(Categories,idUser){
    const result = await db.queryP(
        `DELETE FROM categoriausuario where idCategoria=? and idUsuario=?;`,[Categories.subsCategory,idUser]
    );

    let message = 'Error unsuscribed category';

    if (result.affectedRows) {
        message = 'unsubscription to category sucessfully';
    }

    return message;
}


async function getShowComents(idUser,init,fin){
    const result = await db.queryP(`SELECT u.urlfotoPerfil,c.Comentado,CONCAT(u.nombreUsuario," ",u.apellidoUsuario)as Nombre,u.correo,c.comentario, c.fecha from comentario c
    INNER JOIN usuario u ON c.comentador=u.idUsuario
    where c.idProductoComentado is null AND c.Comentado=? ORDER BY c.fecha DESC
    limit ?, ?`,[idUser,init,fin-init]);
    if (!result) { return [];}
    return result;
}

async function updateProfilePicture(Usuario,idUser){
    const result = await db.queryP(
        `update usuario set urlFotoPerfil=? where idUsuario=?`,
        [
            Usuario.urlPhoto,
            idUser
            
        ]
    );

    let message = 'Error updating Profile Picture';

    if (result.affectedRows) {
        message = 'User Profile Picture sucessfully';
    }

    return message;
}


module.exports={
    update,
    getQualificationUser,
    getUser,
    addSocialMedia,
    subscribedCategoryUser,
    subsCategory,
    unsubsCategory,
    getShowComents,
    getInfo,
    updateProfilePicture
}