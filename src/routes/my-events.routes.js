const express = require('express');
const isAuth = require('../util/is-auth');
const {authenticateWithGoogle} = require('../models/usuario.model');
const canviewAdmin = require('../util/canviewAdmin');
const router = express.Router();


// Definir rutas
router.get('/my-events',isAuth, (req, res) => {
  res.render('./pages/my-events', {
    title: 'My events',
    csrfToken: req.csrfToken(),
    iconClass: 'fa-regular fa-calendar',
  });
});


module.exports =  router;