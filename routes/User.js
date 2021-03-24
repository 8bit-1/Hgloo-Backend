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


module.exports = router;