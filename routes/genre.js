const express = require('express');
const router = express.Router();

const genrE = require('../services/genre');


//GET Genre
//localhost:3000/genre/getGenre
router.get('/getGenre', async function(req, res, next){
    try {
        res.json( await genrE.getGenre());
    } catch (error) {
        console.error("Error while getting Genre: ",error)
    }
} );

module.exports = router;