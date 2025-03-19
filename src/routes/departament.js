const express = require('express');
const Departament = require('../models/departament.model');
 const router = express.Router();
 const departamentController = require('../controllers/departamento')
 
 // Definir rutas
 router.get('/departament',departamentController.getDepartaments);
 router.post('/departament',departamentController.post_agregar_dep)
 
 
 module.exports =  router;