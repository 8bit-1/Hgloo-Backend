const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const profilE = require('../services/Profile');

router.get('/profile/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await profilE.getProfile(uid);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get('/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await profilE.mostProfile(uid);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get('/showprofile/:idUser', async function(req, res, next){
    try {
        res.json( await profilE.getProfile(req.params.idUser));
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
    
} );



module.exports = router;