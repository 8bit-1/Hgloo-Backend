const db = require('./db');

async function addComplaint(complaint,whistleblower,denounced){
    const result = await db.queryP(
        `INSERT INTO denuncia (descripcionDenuncia,idDenunciante,idDenunciado) VALUES (?, ?, ?)`,
        [
            complaint.description,
            whistleblower,
            denounced
        ]
    );

    let message = 'Error creating complaint';

    if (result.affectedRows) {
        message = 'Complaint sucessfully';
    }
    return message;
}


module.exports={
    addComplaint
}
