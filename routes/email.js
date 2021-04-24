const express = require('express');
const router = express.Router();
const email = require('../services/email-controller');

router.get('/send', async ( req, res ) => {
    const message = await email.sendMail();
    res.send( message );
    res.end();
});

module.exports = router;