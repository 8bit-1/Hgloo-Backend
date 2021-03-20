const express = require('express');
const router = express.Router();

const producT = require('../services/product')

//POST
router.post('/register-product/:idUser', async function (req,res, next){  
    try {
        res.json( await producT.registerProduct(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while registering Product`, error.message);
        next(error);
    }
});

//GET
router.get('/product/:idUser', async function(req, res, next){
    try {
        res.json( await producT.getProduct(req.params.idUser));
    } catch (error) {
        console.error("Error while getting countries: ",error)
    }
} );

module.exports = router;