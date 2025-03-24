const express = require('express');
const Request = require('../models/request.model');
 const router = express.Router();
 const requestController = require('../controllers/request.js')
 
 // Definir rutas
 router.get('/request',requestController.getDepartaments);
 router.post('/request',requestController.post_agregar_dep)
 
 
 module.exports =  router;