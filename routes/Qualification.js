const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const qualY = require('../services/Qualification')
//POST
router.post('/update/:idUser/:idCommented', async function (req,res, next){  
    try {
        res.json( await qualY.insertQ(req.body,req.params.idUser,req.params.idCommented) );   
    } catch (error) {
        console.error(`Qualification succesfull`, error.message);
        next(error);
    }
});

//POST
router.post('/insert/:token/:idCommented', async function (req,res, next){  
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await qualY.insertQ(req.body,uid,req.params.idCommented);
            res.json(user);     
        });   
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});


module.exports = router;