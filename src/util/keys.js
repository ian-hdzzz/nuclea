// En tu archivo keys.js
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  database: process.env.DATABASE_URL || {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
  }
}