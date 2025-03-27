const express = require('express');
 const router = express.Router();
 const isAuth = require('../util/is-auth')
 const departamentController = require('../controllers/departamento.controller')
 
 // Definir rutas
 router.get('/departament',isAuth,departamentController.getDepartaments);
 router.post('/departament',isAuth,departamentController.post_agregar_dep)
 
 
 module.exports =  router;