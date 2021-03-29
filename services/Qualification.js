const db = require('./db');


async function insertQ(Usuario,idUser, idCommented){
    const result = await db.queryP(
        `select count(*) as cont from  calificacion where Calificado=? And Calificador=?`,
        [
            idCommented,
            idUser
        ]
    );
    if(result[0].cont==1){
        const result = await db.queryP(
            `update calificacion set Calificacion=? where Calificado=? and Calificador=? `,
            [
                Usuario.Qualification,
                idCommented,
                idUser,
            ]);
    }
    if(result[0].cont==0){
        const result = await db.queryP(
            `insert into calificacion(Calificacion,Calificado,Calificador) VALUES(?,?,?)`,
            [
                Usuario.Qualification,
                idCommented,
                idUser,
            ]);
    }
    let message = 'User inserted  Qualification';

    if (result.affectedRows) {
        message = 'User inserted Qualification';
    }

    return message;
}

async function updateQ(Usuario,idUser, idCommented){
    const result = await db.queryP(
        `update calificacion set Calificacion=? where Calificado=? and Calificador=? `,
        [
            Usuario.Qualification,
            idCommented,
            idUser,
            
            
        ]
    );

    let message = 'Error updating Qualification';

    if (result.affectedRows) {
        message = 'Qualification updated sucessfully';
    }

    return message;
}

module.exports={
    insertQ,
    updateQ   
}