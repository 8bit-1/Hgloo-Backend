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

router.get('/getTopUsers', async function(req, res, next){
    try {
        res.json( await admiN.getTopUsers(req.body));
    } catch (error) {
        console.error("Error while getting users: ",error)
    }
} );

router.get('/getTopCategories', async function(req, res, next){
    try {
        res.json( await admiN.getTopCategory(req.body));
    } catch (error) {
        console.error("Error while getting categories: ",error)
    }
} );

router.get('/getTopProvinces', async function(req, res, next){
    try {
        res.json( await admiN.getTopProvinces(req.body));
    } catch (error) {
        console.error("Error while getting categories: ",error)
    }
} );

//GET
router.get('/getComplaintProduct', async function(req, res, next){
    try {
        res.json( await admiN.getComplaintProducts());
    } catch (error) {
        console.error("Error while getting Genre: ",error)
    }
} );

router.get('/getProductsDate', async function(req, res, next){
    try {
        res.json( await admiN.productsByDate(req.body));
    } catch (error) {
        console.error("Error while getting products: ",error)
    }
} );

router.get('/getCantReports/:date_min/:date_max', async function(req, res, next){
    try {
        res.json( await admiN.getCantReports(req.params.date_min,req.params.date_max));
    } catch (error) {
        console.error("Error while getting reports",error)
    }
} );

//GET
router.get('/getComplaintUsers', async function(req, res, next){
    try {
        res.json( await admiN.getComplaintUsers());
    } catch (error) {
        console.error("Error while getting info denunces user: ",error)
    }
} );


//GET
router.get('/getComplaintComments', async function(req, res, next){
    try {
        res.json( await admiN.getComplaintComments());
    } catch (error) {
        console.error("Error while getting info denunces comments: ",error)
    }
} );

//POST
router.post('/evaluateComplaintProduct/:idProduct', async function (req,res, next){  
    try {
        res.json( await admiN.evaluateComplaintProduct(req.body,req.params.idProduct) );   
    } catch (error) {
        console.error(`Complaint succesfull`, error.message);
        next(error);
    }
});

//POST
router.post('/evaluateComplaintUser/:idUser', async function (req,res, next){  
    try {
        res.json( await admiN.evaluateComplaintUser(req.body,req.params.idUser) );   
    } catch (error) {
        console.error(`Complaint succesfull`, error.message);
        next(error);
    }
});

//POST
router.post('/evaluateComplaintComment/:idCommentary', async function (req,res, next){  
    try {
        res.json( await admiN.evaluateComplaintComments(req.body,req.params.idCommentary) );   
    } catch (error) {
        console.error(`Complaint succesfull`, error.message);
        next(error);
    }
});

module.exports=router;