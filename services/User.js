const db = require('./db');

async function update(Usuario){
    const result = await db.queryP(
        `update usuario set nombreUsuario=?,
         apellidoUsuario=?,
         telefono=?,
         idCiudad=?,
         idDepartamento=?,
         idPais=?,
         idGenero=?,
         idMonedaUsuario=?
         where idUsuario=?`,
        [
            Usuario.name,
            Usuario.lastname,
            Usuario.phone, 
            Usuario.city,
            Usuario.province,
            Usuario.country,
            Usuario.genre,
            Usuario.coin,
            Usuario.id
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