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


module.exports={
    update
}