const express = require('express');
const router = express.Router();

const commenT = require('../services/Commentary')

//POST
router.post('/commentUser/:commentator/:commented', async function (req,res, next){  
    try {
        res.json( await commenT.commentUser(req.body,req.params.commentator,req.params.commented) );
    } catch (error) {
        console.error(`Error while creating commentary`, error.message);
        next(error);
    }
});

//POST
router.post('/commentProduct/:commentator/:idProduct', async function (req,res, next){  
    try {
        res.json( await commenT.commentProduct(req.body,req.params.commentator,req.params.idProduct) );
    } catch (error) {
        console.error(`Error while creating commentary`, error.message);
        next(error);
    }
});


module.exports = router;