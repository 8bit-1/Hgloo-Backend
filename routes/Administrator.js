const express = require('express');
const router = express.Router();

const admiN = require('../services/Administrator');

//POST
router.post('/unsubscribeUser/:idUser', async function (req,res, next){  
    try {
        res.json(await admiN.unsubscribeUser(req.params.idUser) );
    } catch (error) {
        console.error(`Error while unsubscribe user`, error.message);
        next(error);
    }
});

//POST
router.post('/unsubscribeProduct/:idProduct', async function (req,res, next){  
    try {
        res.json( await admiN.unsubscribeProduct(req.params.idProduct) );
    } catch (error) {
        console.error(`Error while unsubscribe product`, error.message);
        next(error);
    }
});

//POST
router.post('/unsubscribeUser2/:idAdmin/:idUser', async function (req,res, next){  
    try {
        res.json(await admiN.unsubscribeUser2(req.params.idAdmin,req.params.idUser) );
    } catch (error) {
        console.error(`Error while unsubscribe user`, error.message);
        next(error);
    }
});

//POST
router.post('/unsubscribeProduct2/:idAdmin/:idProduct', async function (req,res, next){  
    try {
        res.json( await admiN.unsubscribeProduct2(req.params.idAdmin,req.params.idProduct) );
    } catch (error) {
        console.error(`Error while unsubscribe product`, error.message);
        next(error);
    }
});


router.get('/getUsersDate', async function(req, res, next){
    try {
        res.json( await admiN.userByDate(req.body));
    } catch (error) {
        console.error("Error while getting users: ",error)
    }
} );

router.get('/getUsersYear', async function(req, res, next){
    try {
        res.json( await admiN.userByYear(req.body));
    } catch (error) {
        console.error("Error while getting users: ",error)
    }
} );



module.exports=router;