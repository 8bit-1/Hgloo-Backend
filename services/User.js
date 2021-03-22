const db = require('./db');

async function create(Usuario){
    const result = await db.query(
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

    let message = 'Error creating User';

    if (result.affectedRows) {
        message = 'User created sucessfully';
    }

    return message;
}



module.exports={
    create
}