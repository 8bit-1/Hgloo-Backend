const express = require('express');
const router = express.Router();

const condi= require('../services/Condition');


//GET condition
//localhost:3000/condition/getCondition
router.get('/getCondition', async function(req, res, next){
    try {
        res.json( await condi.getCondition());
    } catch (error) {
        console.error("Error while getting condition: ",error)
    }
} );

module.exports = router;