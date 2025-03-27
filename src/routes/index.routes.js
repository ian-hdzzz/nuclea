const express = require('express');
const router = express.Router();

// Definir rutas
router.get('/', (req, res) => {
  res.redirect('/nuclea/signup')
});


module.exports =  router;