const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const producT = require('../services/product');

//GET
router.get('/product/:idUser', async function(req, res, next){
    try {
        res.json( await producT.getProduct(req.params.idUser));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

//POST
router.post('/register/:token', async function (req,res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await producT.registerProduct(req.body,uid);
            res.json(user)});
    } catch (error) {
        console.error('Product register succesfull', error.message);
        next(error);
    }
});

//POST
router.post('/delete/:idProduct/:token', async function (req,res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await producT.deleteProduct(req.params.idProduct,uid);
            res.json(user)});
    } catch (error) {
        console.error('Product deleting succesfull', error.message);
        next(error);
    }
});




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

//GET
router.get('/filtrer/:Product', async function(req, res, next){
    try {
        res.json( await producT.Productbyname(req.params.Product));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

//GET
router.get('/home/:idProduct', async function(req, res, next){
    try {
        res.json( await producT.homeProduct(req.params.idProduct));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

module.exports = router;