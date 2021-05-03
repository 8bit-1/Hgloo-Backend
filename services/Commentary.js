const db = require('./db');

async function commentUser(comment,commentator,commented){
    const result = await db.queryP(
        `INSERT INTO comentario (Comentario, Comentador, Comentado) VALUES (?, ?, ?)`,
        [
            comment.description,
            commentator,
            commented
        ]
    );

    let message = 'Error creating commentary';

    if (result.affectedRows) {
        message = 'commentary sucessfully';
    }
    return message;
}

async function commentProduct(comment,commentator,idProduct){
    const result = await db.queryP(
        `INSERT INTO comentario (Comentario, Comentador, Comentado,idProductoComentado) VALUES (?, ?, (SELECT usuario FROM producto where idProducto=?), ?)`,
        [
            comment.description,
            commentator,
            idProduct,
            idProduct
        ]
    );

    let message = 'Error creating commentary';

    if (result.affectedRows) {
        message = await db.queryP(`SELECT (CONVERT_TZ( NOW(),"-00:00",'America/Tegucigalpa')) as fecha`)
    }
    return message;
}


module.exports = {
    commentUser,
    commentProduct   
}