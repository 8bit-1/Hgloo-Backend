const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const profilE = require('../services/Profile');


router.get('/profile/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await profilE.getProfile(uid);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get('/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await profilE.mostProfile(uid);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get('/showprofile/:idUser', async function(req, res, next){
    try {
        res.json( await profilE.getProfile(req.params.idUser));
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
    
} );

router.get('/view/:token/:idSeller', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await profilE.viewProfile(uid,req.params.idSeller);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting view User: ",error)
    }
});

router.get('/pictureProfile/:idUser', async function(req, res, next){
    try {
        res.json( await profilE.viewPictureProfile(req.params.idUser));
    } catch (error) {
        console.error("Error while getting profile picture User: ",error)
    }
    
} );

router.get('/getProductByCategory/:token/:category/:word', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const productos = await profilE
                .getMyProductsByCategory( 
                    uid, 
                    req.params.category, 
                    req.params.word );
            res.json( productos );
        });
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get('/getProductByCategoryOut/:uid/:category/:word', async function(req, res, next){
    try {
        const productos = await profilE
            .getMyProductsByCategory(
                req.params.uid, 
                req.params.category, 
                req.params.word );
        res.json( productos );
        
    } catch (error) {
        console.error("Error while getting User: ",error)
    }
});

router.get( '/getProductMpPages/:token', async ( req, res ) => {
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const productos = await profilE.getProductsMyPages( uid );
            res.send( productos );
            res.end();
        });
    } catch (error) {
        console.error("Error while getting products by pages user", error);
    }
});

module.exports = router;