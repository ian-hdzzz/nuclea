const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql-flowitbd.alwaysdata.net',  // Reemplaza con tu usuario de AlwaysData
  user: 'flowitbd_general',                      // Tu usuario de AlwaysData
  password: 'lalo123',                // Tu contraseña
  database: 'flowitbd_basededatos',             // El nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0
});

module.exports = pool.promise(); // Usamos .promise() para manejar Promesas 