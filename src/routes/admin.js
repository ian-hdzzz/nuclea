const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/admin', (req, res) => {
  res.render('./pages/admin');
});


module.exports =  router;