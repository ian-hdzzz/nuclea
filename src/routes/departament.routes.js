const express = require('express');
 const router = express.Router();
 const isAuth = require('../util/is-auth')
 const departamentController = require('../controllers/departamento.controller')
 
 // Definir rutas
 router.get('/',isAuth,departamentController.getDepartaments);
 router.post('/',isAuth,departamentController.post_agregar_dep);
 router.get('/delete/:idDepartamento',departamentController.get_delete);
 router.get('/update/:idDepartamento',departamentController.get_update)
router.post('/update/:idDepartamento',departamentController.post_update)

 module.exports =  router;