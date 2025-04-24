const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,  // Reemplaza con tu usuario de AlwaysData
  user: process.env.DB_USER,               // Tu usuario de AlwaysData
  password: process.env.DB_PASSWORD,                    // Tu contraseña
  database: process.env.DB_NAME,       // El nombre de tu base de datos
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
      console.error('Database connection error:', err);
  } else {
      console.log('Successfully connected to the database');
      connection.release();
  }
});

module.exports = pool.promise(); // Usamos .promise() para manejar Promesas
