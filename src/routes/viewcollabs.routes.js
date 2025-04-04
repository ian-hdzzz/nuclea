const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth')
const viewcollabsController = require('../controllers/viewcollabs.controller')
const canviewAdmin = require('../util/canviewAdmin');
 
// Definir rutas
router.get('/',isAuth,viewcollabsController.getDepartaments);


 module.exports =  router;