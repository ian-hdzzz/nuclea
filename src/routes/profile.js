const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/profile', (req, res) => {
  res.render('./pages/profile');
});


module.exports =  router;