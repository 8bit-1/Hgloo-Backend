const express = require('express');
const router = express.Router();

//const mysqlConnection = require('../database');
const usuarioS = require('../services/User')

//POST
router.post('/update/:idUser', async function (req,res, next){  
    try {
        res.json( await usuarioS.update(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});

//GET
router.get('/qualification/:idUser', async function(req, res, next){
    try {
        res.json( await usuarioS.getQualificationUser(req.params.idUser));
    } catch (error) {
        console.error("Error getting grade: ",error)
    }
} );

//GET
router.get('/showUser/:idUser', async function(req, res, next){
    try {
        res.json( await usuarioS.getUser(req.params.idUser));
    } catch (error) {
        console.error("Error getting grade: ",error)
    }
} );

//POST
router.post('/addSocialMedia/:idUser', async function (req,res, next){  
    try {
        res.json( await usuarioS.addSocialMedia(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});

//GET
router.get('/subscribed-category/:idUser', async function(req, res, next){
    try {
        res.json( await usuarioS.subscribedCategoryUser(req.params.idUser));
    } catch (error) {
        console.error("Error getting subscribed category of user: ",error)
    }
} );


//POST
router.post('/add-subsCategory/:idUser', async function (req,res, next){  
    try {
        res.json( await usuarioS.subsCategory(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while suscribed category`, error.message);
        next(error);
    }
});

//POST
router.post('/un-subsCategory/:idUser', async function (req,res, next){  
    try {
        res.json( await usuarioS.unsubsCategory(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while un suscribed category`, error.message);
        next(error);
    }
});


//GET
router.get('/show-comments/:idUser/:init/:fin', async function(req, res, next){
    try {
        res.json( await usuarioS.getShowComents(req.params.idUser,req.params.init,req.params.fin));
    } catch (error) {
        console.error("Error getting show comments of user: ",error) 
    }
 });



router.get('/showInfoUser/:idUser', async function(req, res, next){
    try {
        res.json( await usuarioS.getInfo(req.params.idUser));
    } catch (error) {
        console.error("Error getting grade: ",error)
    }
} );
  
//POST
router.post('/updateProfilePicture/:idUser', async function (req,res, next){  
    try {
        res.json( await usuarioS.updateProfilePicture(req.body,req.params.idUser) );
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});

module.exports = router;