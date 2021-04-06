const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const complainT = require('../services/Complaint');

//POST
router.post('/report-user/:token/:denounced', async function (req,res, next){  
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await complainT.addComplaint(req.body,uid,req.params.denounced);
            res.json( user );
        });
    } catch (error) {
        console.error(`Error while creating complaint`, error.message);
        next(error);
    }
});


//POST
router.post('/report-product/:token/:idProduct', async function (req,res, next){  
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await complainT.reportProduct(req.body,uid,req.params.idProduct);
            res.json( user );
        });
    } catch (error) {
        console.error(`Error while reporting product`, error.message);
        next(error);
    }
});


//POST
router.post('/report-comments/:token/:commentary', async function (req,res, next){  
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await complainT.complaintComment(req.body,uid,req.params.commentary);
            res.json( user );
        });
    } catch (error) {
        console.error(`Error while reporting comment`, error.message);
        next(error);
    }
});


module.exports = router;