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



module.exports={
    update,
    getQualificationUser
}