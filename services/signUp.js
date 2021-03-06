const db = require('./db');
const user = require('./User');

async function registrar(Usuario){
    const result = await db.queryP(
        `call registraUsuario(?,?,?,?,?,?,?,?,?,?)`,
        [
            Usuario.id,
            Usuario.name,
            Usuario.lastname,
            Usuario.email,
            Usuario.phone, 
            Usuario.urlFoto,
            Usuario.city,
            Usuario.province,
            Usuario.country,
            Usuario.genre
        ]
    );

    user.addSocialMedia( Usuario.redesSociales, Usuario.id );

    let message = 'Error creating User';

    if (result.affectedRows) {
        message = 'User created sucessfully';
    }
    return message;
}

module.exports={
    registrar
}