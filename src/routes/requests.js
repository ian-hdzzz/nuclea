const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/requests', (req, res) => {
  res.render('./pages/requests');
});


module.exports =  router;