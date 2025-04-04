const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const canviewAdmin = require('../util/canviewAdmin');
const router = express.Router();


// Definir rutas
router.get('/admin', canviewAdmin ,isAuth, (req, res) => {
  res.render('./pages/admin', {
    title: 'Admin',
    csrfToken: req.csrfToken(),
    iconClass: 'fa-solid fa-user-tie',
  });
});


module.exports =  router;