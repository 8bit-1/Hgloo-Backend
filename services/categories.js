const db = require('./db');

async function getCategory(){
    const result = await db.query(`SELECT idCategoria,nombrecategoria FROM categoria where idEstadoCategoria=1`);
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


async function activateCategory(idCategory){
    const result = await db.queryP(
        `UPDATE categoria set idEstadoCategoria=1 where idCategoria=?`,[idCategory]);

    if (!result) { return [];
    
    }

    let message = 'Error activating category';

    if (result.affectedRows) {
        message = 'Category activated sucessfully';
    }

    return message;

}


async function createCategory(Category){
        const result = await db.queryP(
            `INSERT INTO categoria (nombreCategoria) VALUES (?)`,[Category.name]);
        if (!result) { return [];
        }
        
        let message = 'Error creating category';
        if (result.affectedRows) {
            message = 'Category created sucessfully';
        }

    return message;

}


async function updateValidity(Vigencia){
    const result = await db.queryP(
        `call modificarVigencia (?,?)`,[Vigencia.product,Vigencia.service]);
    if (!result) { return [];
    }
    
    let message = 'Error updating validity';
    if (result.affectedRows) {
        message = 'Validity updated sucessfully';
    }

return message;

}


async function updateCategory(Category,idCategory){
    const result = await db.queryP(
        `UPDATE categoria SET nombreCategoria=? where idCategoria=?`,[Category.nombreCategoria,idCategory]);
    if (!result) { return [];
    }
    
    let message = 'Error updating validity';
    if (result.affectedRows) {
        message = 'Validity updated sucessfully';
    }

return message;

}

async function getDisabledCategory(){
    const result = await db.query(`SELECT idCategoria,nombrecategoria FROM categoria where idEstadoCategoria=2`);
    if (!result) { return [];}
    return result;
}


module.exports = {
    getCategory,
    deleteCategory,
    createCategory,
    updateValidity,
    updateCategory,
    getDisabledCategory,
    activateCategory
}