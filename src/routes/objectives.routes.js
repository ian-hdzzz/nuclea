const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();

// Definir rutas
router.get('/objectives', isAuth,(req, res) => {
  res.render('./pages/objectives');
});


module.exports =  router;