const express = require('express');
const router = express.Router();

const complainT = require('../services/Complaint')

//POST
router.post('/add-complaint/:whistleblower/:denounced', async function (req,res, next){  
    try {
        res.json( await complainT.addComplaint(req.body,req.params.whistleblower,req.params.denounced) );
    } catch (error) {
        console.error(`Error while creating complaint`, error.message);
        next(error);
    }
});


//POST
router.post('/report-product/:whistleblower/:idProduct', async function (req,res, next){  
    try {
        res.json( await complainT.reportProduct(req.body,req.params.whistleblower,req.params.idProduct) );
    } catch (error) {
        console.error(`Error while reporting product`, error.message);
        next(error);
    }
});

//POST
router.post('/report-comment/:whistleblower/:commentary', async function (req,res, next){  
    try {
        res.json( await complainT.complaintComment(req.body,req.params.whistleblower,req.params.commentary) );
    } catch (error) {
        console.error(`Error while reporting comment`, error.message);
        next(error);
    }
});

module.exports = router;