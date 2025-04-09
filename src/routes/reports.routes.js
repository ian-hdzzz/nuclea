const express = require('express');
const isAuth = require('../util/is-auth');
const router = express.Router();

// Definir rutas
router.get('/reports',isAuth,(req, res) => {
  res.render('./pages/reports');
});


module.exports =  router;