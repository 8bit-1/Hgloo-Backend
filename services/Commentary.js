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



module.exports = {
    commentUser   
}