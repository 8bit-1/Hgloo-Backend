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



module.exports = router;