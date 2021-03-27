const db = require('./db');

async function addComplaint(complaint,whistleblower,denounced){
    const result = await db.queryP(
        `call denunciarUsuario(?, ?, ?, ?)`,
        [
            complaint.description,
            whistleblower,
            denounced,
            complaint.report
        ]
    );

    let message = 'Error creating complaint';

    if (result.affectedRows) {
        message = 'Complaint sucessfully';
    }
    return message;
}


//POST
            
async function reportProduct(report,whistleblower,idProduct){
    const result = await db.queryP(
        `call denunciarProducto(?,?,?,?)`,
        [
            report.description,
            whistleblower,
            idProduct,
            report.report
        ]
    );

    let message = 'Error when reporting the product';

    if (result.affectedRows) {
        message = 'Product successfully reported';
    }
    return message;
}


//POST
            
async function complaintComment(report,whistleblower,commentary){
    const result = await db.queryP(
        `call denunciarComentario(?,?,?)`,
        [
            whistleblower,
            commentary,
            report.report
        ]
    );

    let message = 'Error when reporting the comment';

    if (result.affectedRows) {
        message = 'Comment successfully reported';
    }
    return message;
}



module.exports={
    addComplaint,
    reportProduct,
    complaintComment
}
