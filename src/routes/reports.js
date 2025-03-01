const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/reports', (req, res) => {
  res.render('./pages/reports');
});


module.exports =  router;