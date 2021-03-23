const express = require('express');
const router = express.Router();

const categorY = require('../services/categories');
//GET Categories
//localhost:3000/categories/category
router.get('/category', async function(req, res, next){
    try {
        res.json( await categorY.getCategory());
    } catch (error) {
        console.error("Error while getting categories: ",error)
    }
} );



//POST
router.post('/delete-category/:idCategory', async function (req,res, next){  
    try {
        res.json( await categorY.deleteCategory(req.params.idCategory) );
    } catch (error) {
        console.error(`Error while deleting category`, error.message);
        next(error);
    }
});



module.exports=router;