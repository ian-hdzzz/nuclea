const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '',  
  user: '',                      
  password: '',               
  database: '',            
});

module.exports = pool.promise(); // Usamos .promise() para manejar Promesas