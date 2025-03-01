const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/one', (req, res) => {
  res.render('./pages/one');
});


module.exports =  router;