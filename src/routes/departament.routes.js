const express = require('express');
 const router = express.Router();
 const isAuth = require('../util/is-auth')
 const departamentController = require('../controllers/departamento.controller')
 const canviewAdmin = require('../util/canviewAdmin');
 
 // Definir rutas
 router.get('/',isAuth,departamentController.getDepartaments);
 router.post('/',isAuth,departamentController.postAgregarDep)
 router.get('/delete/:idDepartamento',departamentController.getDelete);
 router.get('/update/:idDepartamento',departamentController.getUpdate)
router.post('/update/:idDepartamento',departamentController.postUpdate)
router.get('/search', departamentController.searchDepartments)
 module.exports =  router;