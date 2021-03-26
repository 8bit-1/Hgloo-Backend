const mysql =  require('mysql2/promise');
const config = require('../config');

const pool = mysql.createPool(config.db)


// async function queriP(sql,params){
//     const connection = await mysql.createConnection(config.db);
//     const [results,] = await connection.execute(sql,params);

//     return results
// }

// async function queri(sql){
//     const connection = await mysql.createConnection(config.db);
//     const [results,] = await connection.query(sql)

//     return results
// }

async function queryP(sql, params){
    const [results,] = await pool.execute(sql, params);
    return results;
}

async function query(sql){
    const [results,] = await pool.query(sql);
    return results;
}


module.exports = {
    query,
    queryP
}