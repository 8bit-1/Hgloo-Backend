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


//POST
            
async function reportProduct(report,whistleblower,idProduct,idReport){
    const result = await db.queryP(
        `insert into denuncia(descripcionDenuncia,idDenunciante,idProductoDenunciado,idDenunciado,idReporte) 
         VALUES(?,?,?,(SELECT usuario FROM producto where idProducto=?),?)`,
        [
            report.description,
            whistleblower,
            idProduct,
            idProduct,
            report.idReport
        ]
    );

    let message = 'Error when reporting the product';

    if (result.affectedRows) {
        message = 'Product successfully reported';
    }
    return message;
}




module.exports={
    addComplaint,
    reportProduct
}
