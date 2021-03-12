const express = require('express');
const router = express.Router();

const signUp = require('../services/signUp')

//POST
router.post('/register-user', async function (req,res, next){  
    try {
        res.json( await signUp.registrar(req.body) );
    } catch (error) {
        console.error(`Error while creating user`, error.message);
        next(error);
    }
});


module.exports = router;