const express = require('express');
const router = express.Router();

//const mysqlConnection = require('../database');
const usuarioS = require('../services/Usuario')

//POST
router.post('/create', async function (req,res, next){  
    try {
        res.json( await usuarioS.create(req.body) );
    } catch (error) {
        console.error(`Error while creating programming language`, error.message);
        next(error);
    }
});



module.exports = router;