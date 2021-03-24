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
            Usuario.urlInstagram,
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
    ge.Genero FROM HglooApp.usuario us
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





module.exports={
    update,
    getQualificationUser,
    getUser,
    addSocialMedia,
    subscribedCategoryUser,
    subsCategory,
    unsubsCategory
}