const db = require('./db');

async function getCategory(){
    const result = await db.query(`SELECT nombrecategoria FROM categoria where idEstadoCategoria=1`);
    if (!result) { return [];}
    return result;
}

async function deleteCategory(idCategory){
    const result = await db.queryP(
        `UPDATE categoria set idEstadoCategoria=2 where idCategoria=?`,[idCategory]);

    if (!result) { return [];
    
    }

    let message = 'Error deleting category';

    if (result.affectedRows) {
        message = 'Category deleted sucessfully';
    }

    return message;

}


module.exports = {
    getCategory,
    deleteCategory
}