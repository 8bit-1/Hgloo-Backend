const express = require('express');
const router = express.Router();

const locationS = require('../services/location');


//GET Countries
//localhost:3000/locations/country
router.get('/country', async function(req, res, next){
    res.setHeader('Access-Control-Allow-Methods', '*');
    try {
        res.json( await locationS.getCountry());
    } catch (error) {
        console.error("Error while getting countries: ",error)
    }
} );

//GET country provinces by country Id
//localhost:3000/locations/province/3
router.get('/province/:id', async function(req, res, next){
    res.setHeader('Access-Control-Allow-Methods', '*');
    try {
        res.json( await locationS.getProvinceById(req.params.id));
    } catch (error) {
        console.error("Error while getting province: ",error)
    }
} );

//GET province cities by province id
//localhost:3000/locations/city/3
router.get('/city/:id', async function(req, res, next){
    res.setHeader('Access-Control-Allow-Methods', '*');
    try {
        res.json( await locationS.getCityById(req.params.id));
    } catch (error) {
        console.error("Error while getting countries: ",error)
    }
} );

module.exports = router;