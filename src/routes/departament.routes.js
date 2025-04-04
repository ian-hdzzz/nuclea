const express = require('express');
 const router = express.Router();
 const isAuth = require('../util/is-auth')
 const departamentController = require('../controllers/departamento.controller')
 const canviewAdmin = require('../util/canviewAdmin');
 
 // Definir rutas
 router.get('/',isAuth, canviewAdmin,departamentController.getDepartaments);
 router.post('/',isAuth, canviewAdmin,departamentController.post_agregar_dep)
 router.get('/delete/:idDepartamento', canviewAdmin,departamentController.get_delete);
 router.get('/update/:idDepartamento',canviewAdmin,departamentController.get_update)
router.post('/update/:idDepartamento',canviewAdmin,departamentController.post_update)

 module.exports =  router;