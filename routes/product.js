const express = require('express');
const router = express.Router();

const producT = require('../services/product')

//GET
router.get('/product/:idUser', async function(req, res, next){
    try {
        res.json( await producT.getProduct(req.params.idUser));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

//GET
router.get('/productCount/:idUser', async function(req, res, next){
    try {
        res.json( await producT.getCountProduct(req.params.idUser));
    } catch (error) {
        console.error("Error while count products: ",error)
    }
} );

//POST
router.post('/register-product/:idUser', async function (req,res, next){  
    try {
        res.json( await producT.registerProduct(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});
module.exports = router;