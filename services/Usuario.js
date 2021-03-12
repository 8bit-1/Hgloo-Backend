const db = require('./db');

async function create(Usuario){
    const result = await db.query(
        `registraUsuario(?,?,?,?,?,?,?,?,?,?,?)`,
        [
            Usuario.id,
            Usuario.nombre,
            Usuario.apellido,
            Usuario.correo,
            Usuario.telefono, 
            Usuario.urlFoto,
            Usuario.idCiudad,
            Usuario.idDepartamento,
            Usuario.idPais,
            Usuario.idGenero
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