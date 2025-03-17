const mysql = require('mysql2');
const {database} = require('./keys');

// Crear pool con la URL directa o con los parámetros individuales
const pool = typeof database === 'string' 
  ? mysql.createPool(database).promise()
  : mysql.createPool(database).promise();

pool.getConnection()
  .then(connection => {
    console.log('DB is Connected to Railway');
    connection.release();
  })
  .catch(err => {
    if(err.code === 'PROTOCOL_CONNECTION_LOST'){
      console.error('DATABASE CONNECTION WAS CLOSED');
    }
    if(err.code === 'ERR_CON_COUNT_ERROR'){
      console.error('DATABASE HAS TOO MANY CONNECTIONS');
    }
    if(err.code === 'ECONNREFUSED'){
      console.error('DATABASE CONNECTION WAS REFUSED');
    }
    console.error('Error de conexión:', err);
  });

module.exports = pool;