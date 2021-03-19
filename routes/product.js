const express = require('express');
const router = express.Router();

const producT = require('../services/product')

//POST
router.post('/register-product', async function (req,res, next){  
    try {
        res.json( await producT.registerProduct(req.body) );
    } catch (error) {
        console.error(`Error while registering Product`, error.message);
        next(error);
    }
});

//GET
router.get('/product', async function(req, res, next){
    try {
        res.json( await producT.getProduct());
    } catch (error) {
        console.error("Error while getting countries: ",error)
    }
} );

module.exports = router;