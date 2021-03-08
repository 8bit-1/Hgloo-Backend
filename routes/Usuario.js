const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');


//Ejemplo de consulta a la base
router.get('/personas', (req,res) => {  
    mysqlConnection.query('SELECT * FROM PERSONA',(err,rows,fileds)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    })
})



module.exports = router;