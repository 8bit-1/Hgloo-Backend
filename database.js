const mysql = require('mysql');

/*
Si presenta error: ER_NOT_SUPPORTED_AUTH_MODE
Ejecutar en la Base como admin modificando los respectivos parametros:

ALTER USER 'usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

Para mas informacion preguntar a 8bit.
*/
const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: '8bit',
    password:'12rf1234',
    database: 'Hgloo'    

});

mysqlConnection.connect(function (err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log('Db is connected');
    }
});



module.exports = mysqlConnection;
