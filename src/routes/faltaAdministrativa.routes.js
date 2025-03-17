const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/faltasAdministrativas', (req, res) => {
  res.render('./pages/faltasAdministrativas');
});


module.exports =  router;  