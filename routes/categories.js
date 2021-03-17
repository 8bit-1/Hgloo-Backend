const express = require('express');
const router = express.Router();

const categorY = require('../services/categories');

//GET Categories
//localhost:3000/location/categories
router.get('/category', async function(req, res, next){
    try {
        res.json( await categorY.getCategory());
    } catch (error) {
        console.error("Error while getting categories: ",error)
    }
} );

module.exports=router;