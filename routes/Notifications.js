const express = require('express');
const router = express.Router();

const notificationS = require('../services/Notifications');


//GET
router.get('/getNotifications/:idUser', async function(req, res, next){
    try {
        res.json( await notificationS.getNotification(req.params.idUser));
    } catch (error) {
        console.error("Error while getting notifications: ",error)
    }
} );


//POST
router.post('/viewNotification/:idNotificacion', async function (req,res, next){  
    try {
        res.json( await notificationS.viewNotificacion(req.params.idNotificacion));   
    } catch (error) {
        console.error(`Notification succesfull`, error.message);
        next(error);
    }
});


router.get('/getNotificationst/:token', async function(req, res, next){
    try {
        admin.auth().verifyIdToken( req.params.token ).then( async ( decodedToken ) => {
            const uid = decodedToken.uid;
            const user = await notificationS.getNotification(uid);
            res.json( user );
        });
        
    } catch (error) {
        console.error("Error while getting notifications: ",error)
    }
});
module.exports = router;