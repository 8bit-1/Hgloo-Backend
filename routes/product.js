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

//GET
router.get('/allProducts', async function(req, res, next){
    try {
        res.json( await producT.getAllProducts(req.params.idUser));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

//GET
router.get('/productsHome/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            res.send( await producT.getAllProductsUserLogged( uid ))
            res.end();
        });
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

router.get('/home/:idProduct', async function(req, res, next){
    try {
        res.json( await producT.homeProduct(req.params.idProduct));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );



//GET
router.get('/filter/:Category/:Province/:City', async function(req, res, next){
    try {
        
        if(!req.params.Province && !req.params.City){
            res.json( await producT.ProductbyCategory(req.params.Category));
        }
        else if(req.params.City==0){
            res.json( await producT.ProductbyCatPro(req.params.Category,req.params.Province));
        }
        else if(req.params.Province==0){
            res.json( await producT.ProductbyCatCy(req.params.Category,req.params.City));
        }
        
        else if(req.params.Category==0){
            res.json( await producT.ProductbyProCy(req.params.Province, req.params.City));
        }
        else if(req.params.Category==0 && req.params.City==0){
            res.json( await producT.ProductbyProvince(req.params.Province));
        }
        else {
            res.json( await producT.ProductbyCatProCi(req.params.Category,req.params.Province,req.params.City));
        }
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

router.post( '/byQuery', async ( req, res, next ) => {
    try {
        res.json( await producT.getProductByQuery( req.body.sqlQuery ) );
    } catch (error) {
        console.error("Error while getting products: ",error);
    }
});

router.get( '/searchProduct/:word', async ( req, res, next ) => {
    try {
        res.send( await producT.searchProduct( req.params.word ) );
        res.end();
    } catch ( error ) {
        console.error("Error while getting products: ",error);
    }
});

module.exports = router;