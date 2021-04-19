const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const publI = require('../services/Publicity');

//POST
router.post('/insert/:idProduct/:token', async function (req,res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await publI.Publicity(uid,req.params.idProduct);
            res.json(user)});
    } catch (error) {
        console.error('error inserting publicity', error.message);
        next(error);
    }
});


//GET
router.get('/getPublicity', async function(req, res, next){
    try {
        res.json( await publI.getPublicity());
    } catch (error) {
        console.error("Error while getting Genre: ",error)
    }
} );

//GET
router.get('/getEmail', async function(req, res, next){
    try {
        res.json( await publI.postEmail());
    } catch (error) {
        console.error("Error while getting Genre: ",error)
    }
} );
module.exports = router;