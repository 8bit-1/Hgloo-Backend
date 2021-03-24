const express = require('express');
const router = express.Router();

const profilE = require('../services/Profile');

router.get('/profile/:idUser', async function(req, res, next){
    try {
        res.json( await profilE.getProfile(req.params.idUser));
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
} );


module.exports = router;