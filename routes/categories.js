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


router.get('/maxCategory', async function(req, res, next){
    try {
        res.json( await categorY.getMaxCategory());
    } catch (error) {
        console.error("Error while getting max categories: ",error)
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


//POST
router.post('/activate-category/:idCategory', async function (req,res, next){  
    try {
        res.json( await categorY.activateCategory(req.params.idCategory) );
    } catch (error) {
        console.error(`Error while activating category`, error.message);
        next(error);
    }
});


//POST
router.post('/create-category', async function (req,res, next){  
    try {
        res.json( await categorY.createCategory(req.body) );
    } catch (error) {
        console.error(`Error while creating category`, error.message);
        next(error);
    }
});


//POST
router.post('/update-validity', async function (req,res, next){  
    try {
        res.json( await categorY.updateValidity(req.body) );
    } catch (error) {
        console.error(`Error while updateing validity`, error.message);
        next(error);
    }
});


//POST
router.post('/update-category/:idCategory', async function (req,res, next){  
    try {
        res.json( await categorY.updateCategory(req.body,req.params.idCategory) );
    } catch (error) {
        console.error(`Error while updateing validity`, error.message);
        next(error);
    }
});


router.get('/getValidity', async function(req, res, next){
    try {
        res.json( await categorY.getValidity());
    } catch (error) {
        console.error("Error while getting validity: ",error)
    }
} );


module.exports=router;