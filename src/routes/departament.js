const express = require('express');
const Departament = require('../models/departament.model');
 const router = express.Router();
 const departamentController = require('../controllers/departamento')
 
 // Definir rutas
 router.get('/departament',departamentController.getDepartaments);
 
 
 module.exports =  router;