const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();

// Definir rutas
router.get('/', isAuth,(req, res) => {
  res.redirect('/');
});


module.exports =  router;