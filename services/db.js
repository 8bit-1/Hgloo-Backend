const mysql =  require('mysql2/promise');
const config = require('../config');

async function queryP(sql,params){
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.execute(sql,params);

    return results
}

async function query(sql){
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.query(sql)

    return results
}



module.exports = {
    query,
    queryP
}