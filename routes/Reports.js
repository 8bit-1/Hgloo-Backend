const express = require('express');
const router = express.Router();

const reportS = require('../services/Reports');

//GET reports
router.get('/product', async function(req, res, next){
    try {
        res.json( await reportS.getReportProduct());
    } catch (error) {
        console.error("Error while getting reports products",error)
    }
} );

//GET 
router.get('/user', async function(req, res, next){
    try {
        res.json( await reportS.getReportUser());
    } catch (error) {
        console.error("Error while getting reports users",error)
    }
} );


//GET 
router.get('/comment', async function(req, res, next){
    try {
        res.json( await reportS.getReportComment());
    } catch (error) {
        console.error("Error while getting reports comments",error)
    }
} );



module.exports = router;