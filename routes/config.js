const express = require('express');
const router = express.Router();

const email = require('../services/trigger-emails');

// obtener la configuracion para enviar correos
router.get('/email-date', async function (req, res, next){
    try {
        res.json( await email.obtainData() );
    } catch (error) {
        console.error(`Error while obtaining email configuration`, error.message);
        next(error);
    }
});

router.post('/email-date/update', async function (req, res, next){
    try {
        res.json( await email.updateData(req.body) );
    } catch (error) {
        console.error(`Error while updating email configuration`, error.message);
        next(error);
    }
});

// router.post('/email-date/up3', async function (req, res, next){
//     try {
//         res.json( await email.minutosTres() );
//     } catch (error) {
//         console.error(`Error while obtaining email configuration`, error.message);
//         next(error);
//     }
// });

router.post('/email-date/stop', async function (req, res, next){
    try {
        res.json( await email.stopJob() );
    } catch (error) {
        console.error(`Error while stopping email job`, error.message);
        next(error);
    }
});

router.post('/email-date/start', async function (req, res, next){
    try {
        res.json( await email.startJob() );
    } catch (error) {
        console.error(`Error while starting email job`, error.message);
        next(error);
    }
});


module.exports=router;