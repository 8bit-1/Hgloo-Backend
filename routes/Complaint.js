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


module.exports = router;