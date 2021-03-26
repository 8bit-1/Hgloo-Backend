const express = require('express');
const router = express.Router();

const reportS = require('../services/Reports');

//GET reports
router.get('/get-reports', async function(req, res, next){
    try {
        res.json( await reportS.getReport());
    } catch (error) {
        console.error("Error while getting reports",error)
    }
} );


module.exports = router;