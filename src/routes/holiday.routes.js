const express = require('express');
const router = express.Router();
const isAuth = require('../util/is-auth')
const holidayController = require('../controllers/holiday.controller')
 
// Definir rutas
router.get('/',isAuth,holidayController.get_Holiday);
router.post('/',isAuth,holidayController.post_agregar_holiday)
//router.delete('/delete/:idDepartamento',departamentController.get_delete);
//router.get('/update/:idDepartamento',departamentController.get_update)
//router.post('/update/:idDepartamento',departamentController.post_update)

module.exports =  router;