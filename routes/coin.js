const express = require('express');
const router = express.Router();

const coiN = require('../services/coin');


//GET Coin
//localhost:3000/coin/getCoin
router.get('/getCoin', async function(req, res, next){
    try {
        res.json( await coiN.getCoin());
    } catch (error) {
        console.error("Error while getting countries: ",error)
    }
} );

module.exports = router;