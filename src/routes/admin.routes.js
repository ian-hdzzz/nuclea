const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const canviewAdmin = require('../util/canviewAdmin');
const router = express.Router();


// Definir rutas
router.get('/admin',isAuth, (req, res) => {
  res.render('./pages/admin', {
    title: 'Management',
    csrfToken: req.csrfToken(),
    iconClass: 'fa-solid fa-list-check',
  });
});


module.exports =  router;