const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/objectives', (req, res) => {
  res.render('./pages/objectives');
});


module.exports =  router;