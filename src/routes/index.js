const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/', (req, res) => {
  res.send('Ruta principal');
});


module.exports =  router;